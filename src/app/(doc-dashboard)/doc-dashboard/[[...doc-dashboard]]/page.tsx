"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BadgeCheck, Building2, Calendar, Clock, Mail, MapPin, Phone, Stethoscope, Trophy, Wallet } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { Card } from "@/components/ui/card-hover-effect";
import { CardBody } from "@/components/ui/3d-card";

interface DoctorDetails {
  address: string;
  available_days: string;
  available_time: string;
  clerkid: string;
  clinic_address: string;
  consultation_fee: number;
  department: string;
  name: string;
  phone_number: string;
  specialization: string;
  years_of_experience: number;
}

const DocDashboard: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!user?.id) return;

      try {
        console.log("🔍 Fetching doctor details for:", user.id);
        const response = await fetch(`https://mediverse-backend.onrender.com/doctor/get-details/${user.id}`);
        const data = await response.json();

        if (response.ok && data.clerkid) {
          setDoctorDetails(data);
        } else {
          console.warn("❌ No doctor details found. Redirecting to /doc-create-details...");
          router.replace("/doc-create-details");
        }
      } catch (error) {
        console.error("❌ Error fetching doctor details:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [user?.id, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingScreen /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!doctorDetails) {
    return <div className="text-center text-white">No doctor details found.</div>;
  }
  return (
    <div className="container mx-auto min-h-screen  py-8 px-4 md:px-8 bg-gradient-to-b to-black text-white">
      {/* Header Section */}
      <Card className="border border-neutral-700  shadow-lg rounded-xl bg-gray-900 w-full h-[15%]  mx-auto">
        <CardBody className="p-4 flex w-full flex-col md:flex-row md:items-center md:justify-between h-[15%] gap-2">
          <div className="flex items-center space-x-2 text-primary">
            <Stethoscope className="h-6 w-6 text-teal-400" />
            <h1 className="text-xl font-bold">Welcome Dr {user?.firstName}</h1>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-100">{doctorDetails.name}</h2>
            <p className="text-md text-gray-400">
              {doctorDetails.specialization} • {doctorDetails.department}
            </p>
          </div>
        </CardBody>
      </Card>
  
      {/* Info Cards */}
      <div className="flex  gap-4 mt-6">
        {/* Professional Details */}
        <Card className="border h-fit w-fit border-neutral-700 shadow-lg rounded-xl bg-gray-900">
          <CardBody className="p-4 h-fit  min-w-[30%] space-y-2">
            <div className="flex items-center space-x-2 text-teal-400">
              <Trophy className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Professional Details</h3>
            </div>
            <p className="text-gray-300">Experience: <span className="font-medium">{doctorDetails.years_of_experience} Years</span></p>
            <p className="text-gray-300">Consultation Fee: <span className="font-medium">${doctorDetails.consultation_fee}</span></p>
          </CardBody>
        </Card>
  
        {/* Availability */}
        <Card className="border border-gray-700 shadow-lg rounded-xl bg-gray-900">
          <CardBody className="p-4 h-fit  min-w-[30%] space-y-2">
            <div className="flex items-center space-x-2 text-teal-400">
              <Calendar className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Availability</h3>
            </div>
            <p className="text-gray-300">Days: <span className="font-medium">{doctorDetails.available_days}</span></p>
            <p className="text-gray-300">Time: <span className="font-medium">{doctorDetails.available_time}</span></p>
          </CardBody>
        </Card>
      </div>
  
      {/* Contact Details */}
      <Card className="border border-gray-700 shadow-lg rounded-xl bg-gray-900 mt-6">
        <CardBody className="p-4 w-full h-fit gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-teal-400" />
              <p className="text-gray-300">{doctorDetails.phone_number}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-teal-400" />
              <p className="text-gray-300">{doctorDetails.address}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-teal-400" />
              <p className="text-gray-300">Clinic: {doctorDetails.clinic_address}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};


export default DocDashboard;
