"use client";
import { CardHoverEffectDemo } from "@/components/myhealth";
import React from "react";

function UserHealth() {
  return (
    <div className="flex-grow p-0 m-0 pt-10">
      <h1 className="text-3xl font-bold text-center text-neutral-600 dark:text-white mb-4">
        Patients list
      </h1>
      <CardHoverEffectDemo />
    </div>
  );
}

export default UserHealth;
