"use client";
import { IconStethoscope, IconUser } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UserTypeSelection() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 relative">
      {/* Diagonal Divider */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon fill="url(#gradient)" points="0,0 100,0 100,100" />
        </svg>
        <style jsx>{`
          polygon {
            fill: url(#gradient);
          }
        `}</style>
        <svg>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#4A00E0", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#8E2DE2", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Doctor Section */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-6 w-1/2 h-screen bg-transparent"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/doc-dashboard">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-64 h-64 flex flex-col items-center justify-center mt-[150px]">
            <IconStethoscope className="h-16 w-16 text-teal-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">I am Doctor</h2>
          </div>
        </Link>
      </motion.div>

      {/* Patient Section */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-6 w-1/2 h-screen bg-transparent"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/user-dashboard">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-64 h-64 flex flex-col items-center justify-center mb-[150px]">
            <IconUser className="h-16 w-16 text-blue-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">I am Patient</h2>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
