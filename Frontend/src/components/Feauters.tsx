"use client";
import Link from "next/link";
import featureData from "../data/features.json"; // Adjust the import path as needed
import { BackgroundGradient } from "./ui/background-gradient";

interface Feature {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string; // Added this to handle the image section
  isHighlighted: boolean;
}

function Features() {
  const highlightedFeatures = featureData.features.filter(
    (feature: Feature) => feature.isHighlighted
  );

  return (
    <div className="py-12 dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
      <div>
        <div className="text-center">
          <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
            FEATURES
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Cutting-Edge Technology
          </p>
        </div>
      </div>
      <div className="mt-10 mx-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {highlightedFeatures.map((feature: Feature) => (
            <div key={feature.id} className="flex justify-center">
              <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                  {/* Displaying feature icon */}
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-50 h-50 mb-4"
                  />
                  <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {feature.title}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                    {feature.description}
                  </p>
                  <Link href={`/features/${feature.slug}`}>Learn More</Link>
                </div>
              </BackgroundGradient>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
