import { HoverEffect } from "./ui/card-hover-effect";
import {
  IconUserCircle,
  IconHeartbeat,
  IconStethoscope,
  IconFirstAidKit,
} from "@tabler/icons-react"; // Tabler icons

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={patientData} />
    </div>
  );
}

// Dummy patient-related data
export const patientData = [
  {
    title: "John Doe",
    description: "Age: 45 | Disease: Hypertension, Diabetes",
    link: "#", // You can update this with actual links later
    icon: <IconUserCircle className="h-24 w-24 text-blue-500" />, // Large icon
  },
  {
    title: "Jane Smith",
    description: "Age: 32 | Disease: Asthma, Anxiety",
    link: "#",
    icon: <IconHeartbeat className="h-24 w-24 text-red-500" />, // Large icon
  },
  {
    title: "Mark Johnson",
    description: "Age: 56 | Disease: Coronary Artery Disease",
    link: "#",
    icon: <IconStethoscope className="h-24 w-24 text-green-500" />, // Large icon
  },
  {
    title: "Emily Davis",
    description: "Age: 28 | Disease: Allergies, Migraines",
    link: "#",
    icon: <IconFirstAidKit className="h-24 w-24 text-orange-500" />, // Large icon
  },
];
