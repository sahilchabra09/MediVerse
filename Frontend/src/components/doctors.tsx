"use client";
import { WavyBackground } from "./ui/wavy-background";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const healthcareExperts = [
  {
    id: 1,
    name: "Dr. Sarah Thompson",
    designation: "Cardiologist",
    image: "/images/person1.jpg",
  },
  {
    id: 2,
    name: "John Peterson",
    designation: "Physical Therapist",
    image: "/images/person2.jpg",
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    designation: "Nurse",
    image: "/images/person3.jpg",
  },
  {
    id: 4,
    name: "Dr. James Bond",
    designation: "General Practitioner",
    image: "/images/person4.jpg",
  },
];

function HealthcareExperts() {
  return (
    <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
      <WavyBackground className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
          Meet Our Healthcare Experts
        </h2>
        <p className="text-base md:text-lg text-white text-center mb-4">
          Learn more about the professionals who are revolutionizing patient
          care with technology
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={healthcareExperts} />
        </div>
      </WavyBackground>
    </div>
  );
}

export default HealthcareExperts;
