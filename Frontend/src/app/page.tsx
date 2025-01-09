"use client";
import HealthcareExperts from "@/components/doctors";
import Features from "@/components/Feauters";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { NavbarHome } from "@/components/navbar";
import HealthcareTestimonials from "@/components/Testimoials";

export default function Home() {
  return (
    <div>
      <NavbarHome />
      <HeroSection />
      <Features />
      <HealthcareTestimonials />
      <HealthcareExperts />
      <Footer />
    </div>
  );
}
