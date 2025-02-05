"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  const auth = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="pt-20 ml-64">
        <div className="p-3">
          <h1 className="text-2xl font-bold">
            Welcome to your dashboard, {auth?.user?.name || "Guest"}!
          </h1>
          <p>Enjoy your session.</p>
        </div>
      </div>
    </div>
  );
}
