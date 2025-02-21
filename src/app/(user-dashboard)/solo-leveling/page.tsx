"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/moving-border";

interface RoutineResponse {
  routine: string;
}

interface Report {
  goal: string;
  routine: string;
  created_at: string;
}

export default function SoloLeveling() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  

  const router = useRouter();
  const { user, isLoaded } = useUser();

 // Updated fetchReports function
// Updated fetchReports function
const fetchReports = async () => {
  if (!user?.id) {
    setError("User ID not found");
    return;
  }
  setIsLoading(true);
  setError("");

  try {
    // Use the correct endpoint structure with clerkid as path parameter
    const response = await fetch(
      `https://mediverse-backend.onrender.com/ai/get-routines/${user.id}`
    );

    // Add debug logging
    console.log(`Fetching routines for clerkid: ${user.id}`);
    console.log(`Full URL: https://mediverse-backend.onrender.com/ai/get-routines/${user.id}`);

    const data = await response.json();
    
    if (response.ok) {
      console.log("Received routines:", data);
      setReports(data.routines || []);
    } else {
      setError(data.message || "Failed to fetch routines");
    }
  } catch (err) {
    console.error("Error fetching routines:", err);
    setError("Failed to load routines. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

// Update the interface to match backend response
interface Report {
  created_at: string;
  goal: string;
  routine: string;
}

// Update the state initialization
const [reports, setReports] = useState<Report[]>([]);

  // Submit user goal to generate a new routine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user || !user.id) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting goal:', goal);
      const response = await fetch(
        "https://mediverse-backend.onrender.com/ai/routine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkid: user.id,
            goal: goal,
          }),
        }
      );

      const text = await response.text();
      console.log('Raw routine API response:', text);
      const data = text ? JSON.parse(text) : {};
      console.log('Parsed routine data:', data);

      if (response.ok && data?.routine) {
        console.log('Storing routine in localStorage:', data);
        localStorage.setItem("todoList", JSON.stringify(data));
        router.push("/todo");
      } else {
        console.error('Invalid data received:', data);
        setError("Received invalid data from the server");
      }
    } catch (err) {
      console.error("Error fetching routine:", err);
      setError("Failed to generate routine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Routine Generation Form */}
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
          Solo Leveling Routine Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Input */}
          <div className="flex flex-col">
            <label
              htmlFor="goal"
              className="text-lg font-medium text-gray-700 dark:text-gray-300"
            >
              Enter Your Goal:
            </label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Weight Loss, Muscle Gain"
              className="mt-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-gray-700 dark:text-gray-300 dark:bg-gray-700"
            />
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            className="bg-white dark:bg-gray-900 transition-all ease-in-out hover:bg-gray-950 text-black dark:text-white border-neutral-200 dark:border-neutral-800"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Routine"}
          </Button>
        </form>

        {isLoading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="mt-6">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Existing Routines Section */}
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        {/* Header & Refresh Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Previous Routines
          </h2>
          <Button
            type="button"
            onClick={fetchReports}
            className="bg-gray-900 hover:bg-gray-950 transition-all ease-in-out text-white"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh Reports"}
          </Button>
        </div>

        {/* Routines List */}
        {reports.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No previous routines found.
          </p>
        ) : (
          <ul className="space-y-4">
            {reports.map((report, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Date:</strong>{" "}
                  {new Date(report.created_at).toLocaleString()}
                </p>
                <p className="text-gray-300">
                  <strong>Goal:</strong> {report.goal}
                </p>
                <p className="text-gray-300">
                  <strong>Routine:</strong>
                </p>
                <pre className="whitespace-pre-wrap text-gray-300">
                  {report.routine}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}