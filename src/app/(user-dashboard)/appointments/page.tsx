"use client";
import React, { useState } from "react";
import DoctorList from "@/components/DoctorList";
import NewAppointment from "@/components/NewAppointment";
import AppointmentsList from '@/components/AppointmentsList';

const AppointmentsPage: React.FC = () => {
  const [selectedDoctorClerkId, setSelectedDoctorClerkId] = useState<string | null>(null);

  const handleSelectDoctor = (doctorClerkId: string) => {
    setSelectedDoctorClerkId(doctorClerkId);
  };

  return (
    <div>
      {selectedDoctorClerkId ? (
        <NewAppointment doctorClerkId={selectedDoctorClerkId} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />
      ) : (
        <DoctorList onSelectDoctor={handleSelectDoctor} />
      )}
        <AppointmentsList />
    </div>
  );
};

export default AppointmentsPage;