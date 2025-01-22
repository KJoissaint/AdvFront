"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/ui/navbar";
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  creationAt: string;
  updatedAt: string;
}

export default function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useParams(); // Get userId from the dynamic route
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://api.escuelajs.co/api/v1/users/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        router.push("/users"); // Redirect to the users page if the user is not found
      }
    };

    fetchUser();
  }, [userId, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <p className="text-gray-600"><span className="">Role: </span>{user.role || "N/A"}</p>
          <p className="text-gray-600"><span className="">Creation date: </span>{user.creationAt || "N/A"}</p>
          <p className="text-gray-600"><span className="">Last edited: </span>{user.updatedAt || "N/A"}</p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
