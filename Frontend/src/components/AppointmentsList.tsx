import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Appointment {
  appointment_date: string;
  doctor_clerkid: string;
  id: number;
  patient_clerkid: string;
  status: string;
  text_field: string;
}

const AppointmentsList: React.FC = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://mediverse-backend.onrender.com/appointment/get-appointments/${user?.id}`);
        const data = await response.json();
        if (response.ok) {
          setAppointments(data);
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("An error occurred. Please try again.");
      }
    };

    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  return (
    <div style={{ color: "#fff", backgroundColor: "#333", padding: "20px", borderRadius: "8px" }}>
      <h2>Your Appointments</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {appointments.map((appointment) => (
          <li key={appointment.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #444", borderRadius: "8px", backgroundColor: "#444" }}>
            <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
            <p><strong>Doctor ID:</strong> {appointment.doctor_clerkid}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
            <p><strong>Notes:</strong> {appointment.text_field}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsList;