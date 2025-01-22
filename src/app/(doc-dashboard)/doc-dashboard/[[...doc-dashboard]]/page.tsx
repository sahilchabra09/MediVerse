"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

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

const DocDetails: React.FC = () => {
  const { user } = useUser();
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`https://mediverse-backend.onrender.com/doctor/get-details/${user?.id}`);
        const data = await response.json();
        if (response.ok) {
          setDoctorDetails(data);
        } else {
          setError("Failed to fetch doctor details");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDoctorDetails();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!doctorDetails) {
    return <div className="text-center text-white">No doctor details found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Doctor Dashboard</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">{doctorDetails.name}</h2>
        <p className="text-gray-400"><strong>Specialization:</strong> {doctorDetails.specialization}</p>
        <p className="text-gray-400"><strong>Department:</strong> {doctorDetails.department}</p>
        <p className="text-gray-400"><strong>Years of Experience:</strong> {doctorDetails.years_of_experience}</p>
        <p className="text-gray-400"><strong>Consultation Fee:</strong> ${doctorDetails.consultation_fee}</p>
        <p className="text-gray-400"><strong>Phone Number:</strong> {doctorDetails.phone_number}</p>
        <p className="text-gray-400"><strong>Address:</strong> {doctorDetails.address}</p>
        <p className="text-gray-400"><strong>Clinic Address:</strong> {doctorDetails.clinic_address}</p>
        <p className="text-gray-400"><strong>Available Days:</strong> {doctorDetails.available_days}</p>
        <p className="text-gray-400"><strong>Available Time:</strong> {doctorDetails.available_time}</p>
      </div>
    </div>
  );
};

export default DocDetails;