import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";


interface NewAppointmentProps {
  doctorClerkId: string;
  onClose: () => void; // Add this
}

// Replace all setShowPopup(false) calls with onClose()
const NewAppointment: React.FC<NewAppointmentProps> = ({ doctorClerkId }) => {
  const { user } = useUser();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [textField, setTextField] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Any side effects related to doctorClerkId can be handled here if needed
  }, [doctorClerkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patientClerkId = user?.id;

    try {
      const response = await fetch("https://mediverse-backend.onrender.com/appointment/request-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_date: appointmentDate,
          doctor_clerkid: doctorClerkId,
          patient_clerkid: patientClerkId,
          text_field: textField,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error requesting appointment:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ color: "#fff", backgroundColor: "#333", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <h2>Request a New Appointment</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Appointment Date:</label>
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#555", color: "#fff" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Message for Doctor:</label>
          <input
            type="text"
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#555", color: "#fff" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#007BFF", color: "#fff", cursor: "pointer" }}>
          Request Appointment
        </button>
      </form>
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default NewAppointment;