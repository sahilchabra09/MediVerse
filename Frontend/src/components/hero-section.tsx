"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";
import { Button } from "./ui/moving-border";
import Link from "next/link";

export function HeroSection() {
  const images = ["/images/img1.jpg", "/images/img-2.jpg", "/images/img-3.jpg"];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Your Health, <br /> Our Technology <br /> Smarter Care for a Healthier
          Future
        </motion.p>
        <Link href="/UserTypeSelection">
          <Button
            borderRadius="1.75rem"
            className="  bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            Login/Signnup
          </Button>
        </Link>
      </motion.div>
    </ImagesSlider>
  );
}
