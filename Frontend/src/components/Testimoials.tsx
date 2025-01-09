"use client";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const healthcareTestimonials = [
  {
    quote:
      "The real-time patient monitoring feature provided our clinic with invaluable insights. It has truly transformed the way we care for our patients.",
    name: "Dr. Sarah Thompson",
    title: "Cardiologist",
  },
  {
    quote:
      "The AI-based rehab routines are incredible! They create personalized routines that have helped my patients recover faster and more effectively.",
    name: "John Peterson",
    title: "Physical Therapist",
  },
  {
    quote:
      "Having video consultations directly integrated into the platform has been a game-changer. It allows me to stay connected with patients effortlessly.",
    name: "Dr. Emily Johnson",
    title: "General Practitioner",
  },
  {
    quote:
      "The fall detection and emergency alert system have given our elderly patients and their families peace of mind like never before.",
    name: "Lisa Rodriguez",
    title: "Nurse",
  },
  {
    quote:
      "The OCR-based report uploading feature makes it so much easier to keep track of patient records. Highly efficient and easy to use!",
    name: "Dr. Mark Davis",
    title: "Oncologist",
  },
];

function HealthcareTestimonials() {
  return (
    <div className="h-[40rem] w-full dark:bg-black bg-white bg-dot-black/[0.2] relative flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8 z-10">
        Hear from Our Healthcare Heroes
      </h2>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={healthcareTestimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </div>
  );
}

export default HealthcareTestimonials;
