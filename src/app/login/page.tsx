"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar"; // Import the Navbar

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/users");
      const users = await response.json();

      // Find a matching user
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        setSuccess(`Welcome back, ${user.name}!`);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Login Form */}
      <div className="pt-20 ml-64 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleLogin}
            className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          >
            <h1 className="text-lg font-bold text-gray-700">Log In</h1>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
