"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

interface RoutineResponse {
  routine: string;
}

interface Report {
  created_at: string;
  file_url: string;
  summarized_text: string;
}

export default function SoloLeveling() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to finish loading
    if (!user || !user.id) {
      setError("User not authenticated");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await fetch(`https://mediverse-backend.onrender.com/ai/get-reports/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setReports(data.reports || []);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("An error occurred. Please try again.");
      }
    };

    fetchReports();
  }, [isLoaded, user]);

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
      const response = await fetch("https://mediverse-backend.onrender.com/ai/routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkid: user.id,
          goal: goal,
        }),
      });

      const data = await response.json();

      if (response.ok && data && data.routine) {
        localStorage.setItem("todoList", JSON.stringify(data));
        router.push("/todo");
      } else {
        setError("Received invalid data from the server");
      }
    } catch (error) {
      console.error("Error fetching routine:", error);
      setError("Failed to generate routine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1 p-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Solo Leveling Routine Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-300 dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Routine"}
          </button>
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

      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Previous Routines
        </h2>
        {reports.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No previous routines found.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.created_at} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300"><strong>Date:</strong> {new Date(report.created_at).toLocaleString()}</p>
                <p className="text-gray-300"><strong>Summary:</strong> {report.summarized_text}</p>
                <a href={report.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Full Report
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}