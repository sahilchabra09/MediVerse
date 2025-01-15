"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

function Dashboard() {
  return (
    <div className="flex-1 p-4 bg-gray-900">
      <UserProfile 
        routing="hash"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#111827',
            colorText: '#ffffff',
            colorTextSecondary: '#9ca3af',
            colorInputBackground: '#1f2937',
            colorInputText: '#ffffff',
            borderRadius: '0.5rem',
          },
          elements: {
            card: "bg-gray-800 shadow-xl border-gray-700",
            navbar: "bg-gray-800 border-gray-700",
            navbarButton: "text-gray-300 hover:text-white",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-gray-400",
            formButtonPrimary: 
              "bg-blue-600 hover:bg-blue-700 text-white",
            formButtonReset: 
              "bg-gray-600 hover:bg-gray-700 text-white",
            formFieldInput: 
              "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
            formFieldLabel: "text-gray-300",
            divider: "bg-gray-700",
            profileSectionTitle: "text-xl font-semibold text-white",
            profileSectionPrimaryButton: 
              "bg-blue-600 hover:bg-blue-700 text-white",
            profileSectionSecondaryButton: 
              "bg-gray-600 hover:bg-gray-700 text-white",
          },
        }}
      />
    </div>
  );
}

export default Dashboard; 