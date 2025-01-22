import { SignOutButton } from "@clerk/nextjs";

export default function Logout() {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <SignOutButton>
        <button
          className="px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Click here to Log Out
        </button>
      </SignOutButton>
    </div>
  );
}
