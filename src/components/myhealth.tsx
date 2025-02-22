import React, { useEffect, useState } from "react";
import { HoverEffect } from "./ui/card-hover-effect";
import { IconUserCircle, IconHeartbeat, IconStethoscope } from "@tabler/icons-react";
import LoadingScreen from "./LoadingScreen";

interface User {
  email: string;
  name: string;
  phone_number: string;
  clerkid: string; 
}

interface MyHealthProps {
  searchQuery: string;
}

const MyHealth: React.FC<MyHealthProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://mediverse-backend.onrender.com/doctor/get-all-users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone_number.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div><LoadingScreen/></div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8">
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          No patients found matching your search criteria
        </div>
      ) : (
        <HoverEffect 
          items={filteredUsers.map(user => ({
            title: user.name,
            description: `Email: ${user.email} | Phone: ${user.phone_number}`,
            link: `/patient-detail/${user.clerkid}`, 
            icon: <IconUserCircle className="h-24 w-24 text-blue-500" />,
          }))} 
        />
      )}
    </div>
  );
};

export default MyHealth;