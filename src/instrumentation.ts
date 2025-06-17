import { Browser } from "puppeteer";
import { startLocationScraping, startPackageScraping } from "./scraping";

export const register = async () => {
  if (process.env.NEXT_RUNTIME == "nodejs") {
    // Check for admins

    const admin = await prisma.admin.count();
    console.log({ admin });
    if (!admin) {
      console.log("in if");
      const data = await prisma.admin.create({
        data: {
          email: "admin@arklyte.com",
          password:
            "$2b$10$DcLZAJBMPrECJROnQut8k.XcKjiVnB2v8SMGkIz07W5vjEnUnYoIm",
        },
      });
      console.log({ data });
    }

    const { Worker } = await import("bullmq");
    const { connection } = await import("@/lib/redis");
    const { jobsQueue } = await import("@/lib/queue");
    const puppeteer = await import("puppeteer");
    const SBR_WS_ENDPOINT =
      "wss://brd-customer-hl_4c85eec8-zone-arklyte:mrc5agm28ukz@brd.superproxy.io:9222";
    new Worker(
      "jobsQueue",
      async (job) => {
        let browser: undefined | Browser = undefined;
        try {
          browser = await puppeteer.connect({
            browserWSEndpoint: SBR_WS_ENDPOINT,
          });
          const page = await browser.newPage();
          console.log("Connected! Navigating to " + job.data.url);
          await page.goto(job.data.url, { timeout: 60000 });
          console.log("Navigated! Scraping page content...");
          if (job.data.jobType.type === "location") {
            const packages = await startLocationScraping(page);
            await prisma.jobs.update({
              where: { id: job.data.id },
              data: { isComplete: true, status: "complete" },
            });
            for (const pkg of packages) {
              const jobCreated = await prisma.jobs.findFirst({
                where: {
                  url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                },
              });
              if (!jobCreated) {
                const job = await prisma.jobs.create({
                  data: {
                    url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                    jobType: { type: "package" },
                  },
                });
                jobsQueue.add("package", { ...job, packageDetails: pkg });
              }
            }
          } else if (job.data.jobType.type === "package") {
            console.log("in package");
            // Check if already scraped
            // if not scrape the package
            // Store the package in trips model
            // Mark the job as complete
            const alreadyScraped = await prisma.trips.findUnique({
              where: { id: job.data.packageDetails.id },
            });
            if (!alreadyScraped) {
              const pkg = await startPackageScraping(
                page,
                job.data.packageDetails
              );
              console.log(pkg);

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              await prisma.trips.create({ data: pkg });
              await prisma.jobs.update({
                where: { id: job.data.id },
                data: { isComplete: true, status: "complete" },
              });
            }
          }
        } catch (error) {
          console.log(error);
          await prisma.jobs.update({
            where: { id: job.data.id },
            data: { isComplete: true, status: "failed" },
          });
        } finally {
          await browser?.close();
          console.log("Browser closed successfully.");
        }
      },
      {
        connection,
        concurrency: 10,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      }
    );
  }
};
