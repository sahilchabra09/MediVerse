"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Prescription {
  doctor_clerkid: string;
  doctor_name: string;
  patient_clerkid: string;
  prescription_date: string;
  prescription_text: string;
}

const PrescriptionsPage: React.FC = () => {
  const { user } = useUser();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`https://mediverse-backend.onrender.com/prescription/get-prescriptions/${user?.id}`);
        const data = await response.json();
        if (response.ok) {
          setPrescriptions(data);
        } else {
          setError("Failed to fetch prescriptions");
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPrescriptions();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (prescriptions.length === 0) {
    return <div className="text-center text-white">No prescriptions found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Your Prescriptions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {prescriptions.map((prescription) => (
          <div key={prescription.prescription_date} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Dr. {prescription.doctor_name}</h2>
            <p className="text-gray-400"><strong>Date:</strong> {new Date(prescription.prescription_date).toLocaleString()}</p>
            <p className="text-gray-400"><strong>Prescription:</strong> {prescription.prescription_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsPage;