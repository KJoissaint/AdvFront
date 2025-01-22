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
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

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
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<Partial<User>>({});
  const { userId } = useParams();
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
        setFormData(data); // Initialize form data
      } catch (error) {
        console.error(error);
        router.push("/users");
      }
    };

    fetchUser();
  }, [userId, router]);

  const handleEditToggle = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: formData[field as keyof User] }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>
              {editMode.name ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <FiCheck
                    className="cursor-pointer text-green-500"
                    onClick={() => handleUpdate("name")}
                  />
                  <FiX
                    className="cursor-pointer text-red-500"
                    onClick={() => handleEditToggle("name")}
                  />
                </div>
              ) : (
                <>
                  {user.name}
                  <FiEdit
                    className="inline ml-2 cursor-pointer text-blue-500"
                    onClick={() => handleEditToggle("name")}
                  />
                </>
              )}
            </CardTitle>
            <CardDescription>
              {editMode.email ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <FiCheck
                    className="cursor-pointer text-green-500"
                    onClick={() => handleUpdate("email")}
                  />
                  <FiX
                    className="cursor-pointer text-red-500"
                    onClick={() => handleEditToggle("email")}
                  />
                </div>
              ) : (
                <>
                  {user.email}
                  <FiEdit
                    className="inline ml-2 cursor-pointer text-blue-500"
                    onClick={() => handleEditToggle("email")}
                  />
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <p className="text-gray-600 flex items-center">
              <span className="">Role: </span>
              {editMode.role ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.role || ""}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <FiCheck
                    className="cursor-pointer text-green-500"
                    onClick={() => handleUpdate("role")}
                  />
                  <FiX
                    className="cursor-pointer text-red-500"
                    onClick={() => handleEditToggle("role")}
                  />
                </div>
              ) : (
                <>
                  {user.role || "N/A"}
                  <FiEdit
                    className="inline ml-2 cursor-pointer text-blue-500"
                    onClick={() => handleEditToggle("role")}
                  />
                </>
              )}
            </p>
            <p className="text-gray-600">
              <span className="">Creation date: </span>
              {user.creationAt || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="">Last edited: </span>
              {user.updatedAt || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
