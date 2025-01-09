"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RoutineResponse {
  routine: string;
}

export default function SoloLeveling() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      console.log("Sending request with goal:", goal);
      const response = await axios.post<RoutineResponse>(
        "https://rehab360.pythonanywhere.com/api/routine",
        {
          goal: goal,
        }
      );
      console.log("API Response:", response.data);
      if (response.data && response.data.routine) {
        localStorage.setItem("todoList", JSON.stringify(response.data));
        console.log("Stored in localStorage:", JSON.stringify(response.data));
        router.push("/todo");
      } else {
        setError("Received invalid data from the server");
        console.error("Invalid response data:", response.data);
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
    </div>
  );
}
