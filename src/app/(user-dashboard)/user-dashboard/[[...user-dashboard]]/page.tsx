"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface UserDetails {
  address: string;
  age: number;
  alcohol_consumption: string;
  blood_group: string;
  bmi: number;
  chronic_conditions: string;
  clerkid: string;
  current_health_conditions: string;
  current_medication: string;
  date_of_birth: string;
  dietary_preferences: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  exercise_frequency: string;
  family_medical_history: string;
  first_name: string;
  gender: string;
  height: number;
  insurance_plan_number: string;
  insurance_provider: string;
  insurance_validity: string;
  known_allergies: string;
  last_name: string;
  mental_health_conditions: string;
  phone_number: string;
  previous_major_diseases: string;
  previous_major_surgeries: string;
  smoking_status: string;
  vaccination_history: string;
  weight: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://mediverse-backend.onrender.com/user/get-details/${user?.id}`);
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingScreen/>
    </div>;
  }

  if (!userDetails) {
    return <div className="text-center p-6">No user details found</div>;
  }

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Name" value={`${userDetails.first_name} ${userDetails.last_name}`} />
            <InfoCard label="Email" value={userDetails.email} />
            <InfoCard label="Phone" value={userDetails.phone_number} />
            <InfoCard label="Gender" value={userDetails.gender} />
            <InfoCard label="Age" value={userDetails.age.toString()} />
            <InfoCard label="Address" value={userDetails.address} />
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Blood Group" value={userDetails.blood_group} />
            <InfoCard label="Height" value={`${userDetails.height} cm`} />
            <InfoCard label="Weight" value={`${userDetails.weight} kg`} />
            <InfoCard label="BMI" value={userDetails.bmi.toString()} />
            <InfoCard label="Known Allergies" value={userDetails.known_allergies} />
            <InfoCard label="Current Medication" value={userDetails.current_medication} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Name" value={userDetails.emergency_contact_name} />
            <InfoCard label="Phone" value={userDetails.emergency_contact_phone} />
            <InfoCard label="Relationship" value={userDetails.emergency_contact_relationship} />
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Insurance Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Provider" value={userDetails.insurance_provider} />
            <InfoCard label="Plan Number" value={userDetails.insurance_plan_number} />
            <InfoCard label="Validity" value={userDetails.insurance_validity} />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-700 rounded-lg p-4">
    <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-white">{value || 'Not provided'}</p>
  </div>
);
