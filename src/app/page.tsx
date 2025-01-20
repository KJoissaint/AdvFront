"use client";

import { Navbar } from "@/components/ui/navbar"; // Import the Navbar

export default function Home() {
  return (
    <div>
      {/* Add the Navbar here */}
      <Navbar />

      {/* Content */}
      <div className="pt-20 ml-64">
        {/* Your Dashboard Content */}
        <div className="p-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>Welcome to your dashboard!</p>
        </div>
      </div>
    </div>
  );
}
