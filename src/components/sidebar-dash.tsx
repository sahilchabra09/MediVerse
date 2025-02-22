"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconHome,
  IconHeart,
  IconStethoscope,
  IconFileAnalytics,
  IconArrowLeft,
  IconRun,
  IconMessage,
  IconPrescription,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { SignOutButton, useUser } from "@clerk/nextjs";

export function SidebarDash({ currentPath }: { currentPath: string }) {
  const { user } = useUser();
  const links = [
    {
      label: "Home",
      href: "/user-dashboard",
      icon: (
        <IconHome className="text-gray-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Solo Leveling",
      href: "/solo-leveling",
      icon: (
        <IconRun className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Hospitals Near Me",
      href: "/hospital-near-me",
      icon: (
        <IconHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Appointments",
      href: "/appointments",
      icon: (
        <IconStethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Talk to Doctor",
      href: "/talk-to-doctor",
      icon: (
        <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1  flex-shrink-0" />
      ),
    },
    {
      label: "Report anaylsis",
      href: "/upload-file",
      icon: (
        <IconFileAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Prescriptions",
      href: "/prescriptions",
      icon: (
        <IconPrescription className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 m-1 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto   overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-3">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  isActive={currentPath === link.href}
                />
              ))}
            </div>
          </div>
          <div>
            <SignOutButton>
              <SidebarLink
                link={{
                  label: user?.fullName || "User",
                  href: "#",
                  icon: (
                    <Image
                      src={user?.imageUrl || "https://via.placeholder.com/50"}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </SignOutButton>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        MediVerse
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
