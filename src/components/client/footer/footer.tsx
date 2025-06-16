"use client";
import React from "react";
import { Architects_Daughter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const ArchitectsDaughter = Architects_Daughter({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const Footer = () => {
  const router = useRouter();
  return (
    <footer
      className="min-h-[20vh] px-16 md:px-48 py-10 relative text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/home/home-bg.png")',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm"></div>

      <div className="relative z-10 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-white">
        {/* Logo + Description */}
        <div>
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.png" alt="logo" height={60} width={60} />
            <span className="text-xl uppercase font-medium italic">
              <span className={ArchitectsDaughter.className}>ARKLYTE</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Explore seamlessly curated tours with our all-in-one travel app.
            Effortlessly discover, compare, and book flights, hotels, and tours
            for your next adventure, powered by Next.js.
          </p>
        </div>

        {/* Destinations */}
        <div className="flex flex-col gap-3 pt-5">
          <h3 className="text-xl font-semibold text-pink-500">Destinations</h3>
          <ul className="flex flex-col gap-1 text-gray-300 text-sm">
            <li className="cursor-pointer hover:text-white">USA</li>
            <li className="cursor-pointer hover:text-white">India</li>
            <li className="cursor-pointer hover:text-white">France</li>
            <li className="cursor-pointer hover:text-white">United Kingdom</li>
          </ul>
        </div>

        {/* Adventures */}
        <div className="flex flex-col gap-3 pt-5">
          <h3 className="text-xl font-semibold text-pink-500">Adventures</h3>
          <ul className="flex flex-col gap-1 text-gray-300 text-sm">
            <li className="cursor-pointer hover:text-white">Extreme</li>
            <li className="cursor-pointer hover:text-white">In the air</li>
            <li className="cursor-pointer hover:text-white">Nature and Wildlife</li>
            <li className="cursor-pointer hover:text-white">Winter Sports</li>
            <li className="cursor-pointer hover:text-white">Outdoor Parks</li>
            <li className="cursor-pointer hover:text-white">Water Sports</li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-3 pt-5">
          <h3 className="text-xl font-semibold text-pink-500">Get in touch</h3>
          <ul className="flex gap-4 mt-4">
            {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter].map(
              (Icon, i) => (
                <li
                  key={i}
                  className="bg-purple-700/20 hover:bg-purple-700/40 text-purple-400 text-2xl p-3 rounded-md cursor-pointer transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                >
                  <Icon />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
