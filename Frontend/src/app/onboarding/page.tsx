"use client";
import { useUser } from "@clerk/nextjs";

const OnboardingPage = () => {
  const { user } = useUser();

  // Check if the user is null or undefined
  if (!user) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
  }

  const assignRole = async (role: "member" | "doctor") => {
    await user.update({
      publicMetadata: { role }, // No error now for publicMetadata
    });

    // Redirect based on the role
    if (role === "doctor") {
      window.location.href = "/doc-dashboard";
    } else {
      window.location.href = "/user-dashboard";
    }
  };

  return (
    <div>
      <h1>Select Your Role</h1>
      <button onClick={() => assignRole("doctor")}>Doctor</button>
      <button onClick={() => assignRole("member")}>Member</button>
    </div>
  );
};

export default OnboardingPage;
