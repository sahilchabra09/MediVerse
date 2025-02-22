import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import NewAppointment from "./NewAppointment"; // Make sure to import the NewAppointment component

interface Appointment {
  appointment_date: string;
  doctor_clerkid: string;
  hospital_id: number;
  hospital_name: string;
  id: number;
  patient_clerkid: string;
  status: string;
  text_field: string;
}

interface DoctorDetails {
  clerkid: string;
  first_name: string;
  last_name: string;
}
interface NewAppointmentProps {
  doctorClerkId: string;
  onClose: () => void;
}
const AppointmentsList: React.FC = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState("");
  const [doctorNames, setDoctorNames] = useState<{[key: string]: string}>({});
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `https://mediverse-backend.onrender.com/appointment/get-appointments/${user?.id}`
        );
        const data = await response.json();
        
        if (response.ok) {
          setAppointments(data);
        } else {
          setMessage(data.error || "Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("An error occurred. Please try again.");
      }
    };

    if (user?.id) fetchAppointments();
  }, [user?.id]);

  // Fetch doctor names
  useEffect(() => {
    const fetchDoctorNames = async (doctorIds: string[]) => {
      try {
        const uniqueIds = Array.from(new Set(doctorIds));
        const doctors = await Promise.all(
          uniqueIds.map(async (id) => {
            const response = await fetch(
              `https://mediverse-backend.onrender.com/doctor/get-details/${id}`
            );
            const data = await response.json();
            return { id, name: `${data.first_name} ${data.last_name}` };
          })
        );

        const namesMap = doctors.reduce((acc, doctor) => ({
          ...acc,
          [doctor.id]: doctor.name
        }), {});

        setDoctorNames(namesMap);
      } catch (error) {
        console.error("Error fetching doctor names:", error);
      }
    };

    if (appointments.length > 0) {
      const doctorIds = appointments.map(a => a.doctor_clerkid);
      fetchDoctorNames(doctorIds);
    }
  }, [appointments]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Your Appointments
        </h2>
      
      </div>

      {showAppointmentPopup && (
        <NewAppointment 
          doctorClerkId={selectedDoctorId || ""} 
          onClose={() => setShowAppointmentPopup(false)}
        />
      )}

      {message && (
        <p className="text-center text-red-500 text-sm mb-4">{message}</p>
      )}

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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Doctor: <span className="font-medium">
                    {doctorNames[appointment.doctor_clerkid] || "Loading..."}
                  </span>
                </p>
                {appointment.text_field && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                    &quot;{appointment.text_field}&quot;
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && !message && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No upcoming appointments
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;