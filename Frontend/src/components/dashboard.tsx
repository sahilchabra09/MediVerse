import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconHeartbeat,
  IconTemperature,
  IconLungs,
  IconMoonStars,
  IconRun,
  IconReportAnalytics,
  IconStethoscope,
  IconFileDescription,
} from "@tabler/icons-react"; // Icons for features

export function BentoGridDemo() {
  return (
    <BentoGrid className=" mx-auto px-5">
      {features.map((feature, i) => (
        <BentoGridItem
          key={i}
          title={feature.title}
          description={feature.description}
          header={feature.header}
          icon={feature.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

// Updated features data
const features = [
  {
    title: "Heart Rate (ECG)",
    description: "View your real-time heart rate and ECG data.",
    header: <Skeleton />,
    icon: <IconHeartbeat className="h-6 w-6 text-red-500" />,
  },
  {
    title: "Temperature",
    description: "Monitor your body temperature accurately.",
    header: <Skeleton />,
    icon: <IconTemperature className="h-6 w-6 text-orange-500" />,
  },
  {
    title: "Oxygen Content",
    description: "Track your blood oxygen levels effectively.",
    header: <Skeleton />,
    icon: <IconLungs className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Sleep Data",
    description: "Analyze your sleep patterns and quality.",
    header: <Skeleton />,
    icon: <IconMoonStars className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "AI-Based Solo Leveling Routines",
    description: "Personalized rehab routines powered by AI.",
    header: <Skeleton />,
    icon: <IconRun className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Report Summarizer",
    description: "Summarize medical reports using OCR and AI.",
    header: <Skeleton />,
    icon: <IconReportAnalytics className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "Talk to Doctor",
    description: "Instantly connect with a doctor via video call.",
    header: <Skeleton />,
    icon: <IconStethoscope className="h-6 w-6 text-teal-500" />,
  },
  {
    title: "Upload and Analyze Reports",
    description: "Easily upload medical reports for detailed analysis.",
    header: <Skeleton />,
    icon: <IconFileDescription className="h-6 w-6 text-pink-500" />,
  },
];
