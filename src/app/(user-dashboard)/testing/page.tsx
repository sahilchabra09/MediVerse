"use client";

interface UserDetails {
  address: string;
  age: number;
  blood_group: string;
  height: number;
  weight: number;
  bmi: number;
  known_allergies: string;
  current_medication: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  insurance_provider: string;
  insurance_plan_number: string;
  insurance_validity: string;
  phone_number: string;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Dashboard() {
  // Just a hard-coded example object for the UI
  const userDetails: UserDetails = {
    address: "123 Main St, Anytown, USA",
    age: 30,
    blood_group: "O+",
    height: 170,
    weight: 65,
    bmi: 22,
    known_allergies: "Peanuts, Dust",
    current_medication: "None",
    emergency_contact_name: "John Doe",
    emergency_contact_phone: "555-1234",
    emergency_contact_relationship: "Brother",
    insurance_provider: "ACME Insurance",
    insurance_plan_number: "PLAN-12345",
    insurance_validity: "2025-12-31",
    phone_number: "555-6789",
    gender: "Female",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
  };

  return (
    <div className="p-6 min-h-screen">
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

// Reusable info card component
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-700 rounded-lg p-4">
    <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-white">{value || "Not provided"}</p>
  </div>
);
