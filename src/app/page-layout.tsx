"use client";
import React from "react";
import { Footer } from "@/components/client/footer";
import { Navbar } from "@/components/client/navbar";
import Image from "next/image";
import { useDisclosure } from "@heroui/react";
import { AuthModal } from "@/components/client/auth-modal";
import { usePathname } from "next/navigation";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  return (
    <>
      {pathname.includes("/admin") ? (
        children
      ) : (
        <div
          className="relative flex flex-col min-h-screen text-white"
          id="app-container"
        >
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/home/home-bg.png"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            {/* Optional blur effect over the whole screen */}
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(6px) saturate(180%)",
                WebkitBackdropFilter: "blur(6px) saturate(180%)",
              }}
            ></div>
          </div>

          <main className="flex flex-col flex-1 relative z-10">
            <Navbar onOpen={onOpen} />
            <section className="flex-1">{children}</section>
            <AuthModal
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
            <Footer />
          </main>
        </div>
      )}
    </>
  );
};

export default PageLayout;
