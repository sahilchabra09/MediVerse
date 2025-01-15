"use client";

import { Button } from "@/components/ui/moving-border";

export default function TalkToDoctor() {
  const moderatorURL =
    "https://meet.jit.si/roomName#config.prejoinPageEnabled=false&userInfo.displayName=Moderator";

  const startInstantMeeting = () => {
    fetch("https://rehab360.pythonanywhere.com/api/doctorCall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meeting_id: "roomName",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        window.open(moderatorURL, "_blank");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Begin Your Consultation
        </h1>
        <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
          You will be taken to a secure video call in a new tab.
        </p>
        <Button
          onClick={startInstantMeeting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          Start Meeting
        </Button>
      </div>
    </div>
  );
}
