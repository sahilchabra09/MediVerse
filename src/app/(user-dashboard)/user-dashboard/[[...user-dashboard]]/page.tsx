"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

interface UserDetails {
  clerkid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  age: number | null;
  address: string;
  blood_group: string;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  known_allergies: string;
  current_medication: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  insurance_provider: string;
  insurance_plan_number: string;
  insurance_validity: string;
}

interface UserReport {
  created_at: string;
  file_url: string;
  summarized_text: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;
      try {
        console.log("🔍 Fetching user details for:", user.id);
        const response = await fetch(`https://mediverse-backend.onrender.com/user/get-details/${user.id}`);
        const data = await response.json();
        if (response.ok && data) {
          setUserDetails(data);
        } else {
          console.warn("❌ No user details found. Redirecting to /create-details...");
          router.replace("/create-details");
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, router]);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!userDetails?.clerkid) return;
      setReportsLoading(true);
      try {
        console.log("📂 Fetching reports for ClerkID:", userDetails.clerkid);
        const response = await fetch(`https://mediverse-backend.onrender.com/ai/get-reports/${userDetails.clerkid}`);
        const data = await response.json();
        
        if (response.ok && data.reports) {
          setUserReports(data.reports);
        } else {
          console.warn("⚠ No reports found for user.");
          setUserReports([]);
        }
      } catch (error) {
        console.error("❌ Error fetching user reports:", error);
      } finally {
        setReportsLoading(false);
      }
    };

    if (userDetails?.clerkid) {
      fetchUserReports();
    }
  }, [userDetails?.clerkid]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingScreen /></div>;
  }

  if (!userDetails) {
    return <div className="text-center p-6">No user details found</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Name" value={`${userDetails.first_name} ${userDetails.last_name}`} />
            <InfoCard label="Email" value={userDetails.email} />
            <InfoCard label="Phone" value={userDetails.phone_number} />
            <InfoCard label="Gender" value={userDetails.gender} />
            <InfoCard label="Age" value={userDetails.age ? userDetails.age.toString() : 'Not provided'} />
            <InfoCard label="Address" value={userDetails.address} />
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Blood Group" value={userDetails.blood_group} />
            <InfoCard label="Height" value={userDetails.height ? `${userDetails.height} cm` : 'Not provided'} />
            <InfoCard label="Weight" value={userDetails.weight ? `${userDetails.weight} kg` : 'Not provided'} />
            <InfoCard label="BMI" value={userDetails.bmi ? userDetails.bmi.toString() : 'Not provided'} />
            <InfoCard label="Known Allergies" value={userDetails.known_allergies} />
            <InfoCard label="Current Medication" value={userDetails.current_medication} />
          </div>
        </div>
           {/* Insurance Information */}
           <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Insurance Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Provider" value={userDetails.insurance_provider} />
            <InfoCard label="Plan Number" value={userDetails.insurance_plan_number} />
            <InfoCard label="Validity" value={userDetails.insurance_validity} />
          </div>
        </div>

   

<div className="bg-gray-900 rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-bold text-white mb-4">Past Reports</h2>

  {reportsLoading ? (
    <p className="text-gray-400 text-center">Loading reports...</p>
  ) : userReports.length > 0 ? (
    <div className="space-y-4">
      {userReports.map((report) => {
       

        return (
          <div
            key={report.created_at}
            className="p-4 bg-gray-950 rounded-lg border border-gray-900 transition-all duration-300 ease-in-out"
          >
            {/* Header Section with Date & Toggle Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                {new Date(report.created_at).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-gray-700 hover:bg-gray-950 rounded-lg transition-all duration-300"
              >
                {isOpen ? "Hide Report" : "View Report"}
              </button>
            </div>

            {/* Report Content (Collapsible) */}
            {isOpen && (
              <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-md border border-neutral-700">
                <p className="text-gray-300 leading-relaxed">{report.summarized_text}</p>
                <a
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition duration-300"
                >
                  Open Full Report
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-400 text-center">No reports found.</p>
  )}
</div>

      </div>
    </div>
  );
}

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-white">{value || 'Not provided'}</p>
  </div>
);
