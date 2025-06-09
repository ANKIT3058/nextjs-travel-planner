import { Browser } from "puppeteer";
import { startLocationScraping } from "./scraping";

export const register = async () => {
  if (process.env.NEXT_RUNTIME == "nodejs") {
    const { Worker } = await import("bullmq");
    const { connection, jobsQueue } = await import("@/lib");
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
          if (job.data.jobType.type === "location") {
            console.log("Connected! Navigating to " + job.data.url);
            await page.goto(job.data.url);
            console.log("Navigated! Scraping page content...");
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
