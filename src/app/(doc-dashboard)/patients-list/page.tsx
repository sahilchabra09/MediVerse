"use client";
import MyHealth from "@/components/myhealth";
import React, { useState } from "react";

function UserHealth() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-grow p-0 m-0 pt-10">
      <h1 className="text-3xl font-bold text-center text-neutral-600 dark:text-white mb-4">
        Patients list
      </h1>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 px-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          autoFocus
        />
      </div>

      <MyHealth searchQuery={searchQuery} />
    </div>
  );
}

export default UserHealth;