"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/moving-border";
import { useUser } from "@clerk/nextjs";

interface PatientDetails {
  clerkid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  age: number;
  blood_group: string;
  address: string;
}

interface UserReport {
  created_at: string;
  file_url: string;
  summarized_text: string;
}

// Add these new interfaces
interface AppointmentFormData {
  appointment_date: string;
  doctor_clerkid: string;
  hospital_id: number;
  patient_clerkid: string;
  text_field: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  doctor_clerkid: string;
  hospital_id: number;
  hospital_name: string;
  status: string;
  text_field: string;
}
// Add to existing interfaces
interface Prescription {
  id: string;
  created_at: string;
  prescription_text: string;
  doctor_clerkid: string;
  hospital_id: number;
  patient_clerkid: string;
}

interface PrescriptionFormData {
  prescription_text: string;
  doctor_clerkid: string;
  hospital_id: number;
  patient_clerkid: string;
}


export default function PatientDetail() {
  const params = useParams();
  const { user } = useUser();
  const [expandedSummaries, setExpandedSummaries] = useState<boolean[]>([]);
  const clerkid = params.clerkid as string;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionFormData, setPrescriptionFormData] = useState<PrescriptionFormData>({
    prescription_text: '',
    doctor_clerkid: user?.id || '',
    hospital_id: 4, // Hardcoded hospital ID
    patient_clerkid: clerkid
  });
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  // const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    appointment_date: '',
    doctor_clerkid: user?.id || '', // Get doctor's Clerk ID from authenticated user
    hospital_id: 4, // Hardcoded hospital ID
    patient_clerkid: clerkid,
    text_field: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

 
  
  // Add this form handler function
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
  
    try {
      const response = await fetch('https://mediverse-backend.onrender.com/appointment/add-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hospital_id: Number(formData.hospital_id),
          patient_clerkid: clerkid
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }
  
      setShowAppointmentForm(false);
      alert('Appointment created successfully!');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://mediverse-backend.onrender.com/prescription/add-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create prescription');
      }

      // Get the response data
      const responseData = await response.json();
      
      // Update prescriptions list with new prescription
      const newPrescription = {
        id: responseData.id || Date.now().toString(), // Fallback ID if not provided
        created_at: new Date().toISOString(),
        ...prescriptionFormData
      };
      
      setPrescriptions(prev => [...prev, newPrescription]);
      setShowPrescriptionForm(false);
      
      // Reset form
      setPrescriptionFormData({
        prescription_text: '',
        doctor_clerkid: user?.id || '',
        hospital_id: 4,
        patient_clerkid: clerkid
      });

      // Show success message
      alert('Prescription added successfully!');
      
    } catch (err: any) {
      setFormError(err.message || 'Failed to add prescription');
      console.error('Prescription submission error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    setExpandedSummaries(new Array(reports.length).fill(false));
  }, [reports]);

  const toggleSummary = (index: number) => {
    setExpandedSummaries(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };
  

// Update fetchData useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('Starting data fetch for clerkid:', clerkid);
      if (!clerkid || typeof clerkid !== "string") {
        throw new Error("Invalid Clerk ID format");
      }

      const urls = [
        `https://mediverse-backend.onrender.com/user/get-details/${encodeURIComponent(clerkid)}`,
        `https://mediverse-backend.onrender.com/ai/get-reports/${encodeURIComponent(clerkid)}`,
        `https://mediverse-backend.onrender.com/appointment/get-appointments/${encodeURIComponent(clerkid)}`,
        `https://mediverse-backend.onrender.com/prescription/get-prescriptions/${encodeURIComponent(clerkid)}`
      ];

      console.log('Fetching from URLs:', urls);

      const [detailsResponse, reportsResponse, appointmentsResponse, prescriptionsResponse] = await Promise.all([
        fetch(urls[0]),
        fetch(urls[1]),
        fetch(urls[2]),
        fetch(urls[3])
      ]);

      console.log('Response statuses:', {
        details: detailsResponse.status,
        reports: reportsResponse.status,
        appointments: appointmentsResponse.status
      });

      if (!detailsResponse.ok || !reportsResponse.ok || !appointmentsResponse.ok) {
        console.error('One or more requests failed:', {
          detailsOk: detailsResponse.ok,
          reportsOk: reportsResponse.ok,
          appointmentsOk: appointmentsResponse.ok
        });
        throw new Error("Failed to fetch patient data");
      }

      const detailsData = await detailsResponse.json();
      const reportsData = await reportsResponse.json();
      const appointmentsData = await appointmentsResponse.json();

      console.log('Received data:', {
        detailsData,
        reportsData,
        appointmentsData
      });

      setPatient(detailsData);
      setReports(reportsData.reports || []);
      setAppointments(appointmentsData || []);

      console.log('State after update:', {
        patient: detailsData,
        reportsCount: reportsData.reports?.length || 0,
        appointmentsCount: appointmentsData.appointments?.length || 0
      });

      if (!prescriptionsResponse.ok) {
        console.error('Prescriptions fetch failed:', prescriptionsResponse.status);
        setPrescriptions([]); // Set empty array on error
        return;
      }

      const prescriptionsData = await prescriptionsResponse.json();
      // Ensure we're setting an array
      setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);

    } catch (err: any) {
      console.error("Fetch error:", {
        error: err,
        message: err.message,
        clerkid,
        timestamp: new Date().toISOString()
      });
      setError(err.message || "Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [clerkid]);



  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8 p-4 bg-red-50 rounded-lg">
        <p className="font-bold">Error Loading Patient Data:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">ClerkID: {clerkid}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No patient data found for this ID
      </div>
    );
  }

  console.log('Rendering component state:', {
    patientExists: !!patient,
    reportsCount: reports.length,
    appointmentsCount: appointments.length,
    appointments: appointments,
    loading,
    error
  });

  return (
    <div className=" p-8 bg-gray-50 dark:bg-gray-950 min-h-screen space-y-8">
     <div className="flex justify-between mb-8">
  <Button
    onClick={() => window.history.back()}
    className="p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-neutral-200 dark:border-gray-700"
  >
    ← Back to Patients
  </Button>
  <Button
    onClick={() => setShowAppointmentForm(true)}
     className="p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-neutral-200 dark:border-gray-700"
    >+ Add Appointment
  </Button>
</div>
      {/* Patient Information Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {patient.first_name} {patient.last_name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Email" value={patient.email} />
          <DetailItem label="Phone" value={patient.phone_number} />
          <DetailItem label="Age" value={patient.age.toString()} />
          <DetailItem label="Blood Group" value={patient.blood_group} />
          <DetailItem label="Address" value={patient.address} />
          <DetailItem label="Clerk ID" value={patient.clerkid} />
        </div>
      </div>
      {showAppointmentForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">New Appointment</h3>
        
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={formData.appointment_date}
              onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
            />
          </div>

          <input
            type="hidden"
            value={formData.hospital_id}
          />

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Notes
            </label>
            <textarea
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              rows={3}
              value={formData.text_field}
              onChange={(e) => setFormData({...formData, text_field: e.target.value})}
            />
          </div>

          {formError && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={() => setShowAppointmentForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              disabled={formLoading}
            >
              {formLoading ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )}

<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
    Appointment History
  </h2>
  
  {appointments.length === 0 ? (
    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
      No appointments scheduled
    </div>
  ) : (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div 
          key={appointment.id}
          className="border-l-4 border-green-500 pl-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {new Date(appointment.appointment_date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {appointment.hospital_name}
                </p>
              </div>
            </div>
            
            <div className="md:text-right">
              {appointment.text_field && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  &quot;{appointment.text_field}&quot;
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      Prescriptions
    </h2>
    <Button
      onClick={() => setShowPrescriptionForm(true)}
      className="p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      + Add Prescription
    </Button>
  </div>

  {!Array.isArray(prescriptions) ? (
    <div className="text-center py-6 text-red-500">
      Error loading prescriptions
    </div>
  ) : prescriptions.length === 0 ? (
    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
      No prescriptions found
    </div>
  ) : (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <div 
          key={prescription.id}
          className="border-l-4 border-purple-500 pl-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg"
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(prescription.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {prescription.prescription_text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{showPrescriptionForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4 dark:text-gray-100">New Prescription</h3>
      
      <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Prescription Details
          </label>
          <textarea
            required
            className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            rows={6}
            value={prescriptionFormData.prescription_text}
            onChange={(e) => setPrescriptionFormData({
              ...prescriptionFormData,
              prescription_text: e.target.value
            })}
          />
        </div>

        {formError && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {formError}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => setShowPrescriptionForm(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={formLoading}
          >
            {formLoading ? 'Saving...' : 'Save Prescription'}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Health Reports Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Medical Reports
        </h2>
        
        {reports.map((report, index) => (
  <div 
    key={index}
    className="border-l-4 border-blue-500 pl-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg mb-4"
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Report #{index + 1}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(report.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <a
        href={report.file_url}
        download
        className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Report
      </a>
    </div>
    
    {report.summarized_text && (
      <div className="mt-4">
        <button
          onClick={() => toggleSummary(index)}
          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {expandedSummaries[index] ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Hide Summary
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Show Summary
            </>
          )}
        </button>

        {expandedSummaries[index] && (
          <div className="mt-2 transition-all duration-300 ease-in-out">
            <div className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed space-y-2">
              {report.summarized_text.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-950">
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-gray-800 dark:text-gray-200 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}