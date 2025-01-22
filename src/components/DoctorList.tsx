import React, { useEffect, useState } from "react";
import { HoverEffect } from "./ui/card-hover-effect";

interface Doctor {
  clerkid: string;
  first_name: string;
  last_name: string;
  specialization: string;
}

interface DoctorListProps {
  onSelectDoctor: (doctorClerkId: string) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("https://mediverse-backend.onrender.com/doctor/get-all-doctors");
        const data = await response.json();
        if (response.ok) {
          setDoctors(data);
        } else {
          setError("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <div key={doctor.clerkid} onClick={() => onSelectDoctor(doctor.clerkid)} className="cursor-pointer">
          <HoverEffect
            items={[{
              title: `${doctor.first_name} ${doctor.last_name}`,
              description: doctor.specialization,
              link: "#"
            }]}
          />
        </div>
      ))}
    </div>
  );
};

export default DoctorList;