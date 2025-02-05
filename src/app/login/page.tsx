"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Navbar } from "@/components/ui/navbar";

export default function Page() {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!auth) {
    return null; // Prevents undefined context error
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.login(email, password);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-20 ml-64 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-lg font-bold text-gray-700">Log In</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-blue-600">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
