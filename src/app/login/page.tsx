"use client";

import { LoginForm } from "@/components/login-form";
import { Navbar } from "@/components/ui/navbar"; // Import the Navbar

export default function Page() {
  return (
    <div>
      {/* Add Navbar here */}
      <Navbar />

      {/* Content (Login Form) */}
      <div className="pt-20 ml-64 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
