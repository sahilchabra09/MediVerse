"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OnboardingPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  const assignRole = async (role: "member" | "doctor") => {
    try {
      setIsUpdating(true);
      
      // Update user metadata
      await user.update({
        unsafeMetadata: {
          role: role,
        },
      });

      // Force a session reload to update the claims
      await user.reload();

      // Wait a brief moment for the update to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect based on role
      if (role === "doctor") {
        router.push("/doc-dashboard");
      } else {
        router.push("/user-dashboard");
      }
      
      // Force a page refresh to ensure new role is picked up
      router.refresh();
      
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Select Your Role</h1>
        <div className="space-y-4">
          <button
            onClick={() => assignRole("doctor")}
            disabled={isUpdating}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? "Processing..." : "Doctor"}
          </button>
          <button
            onClick={() => assignRole("member")}
            disabled={isUpdating}
            className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isUpdating ? "Processing..." : "Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
