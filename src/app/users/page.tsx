"use client";

import { useCallback, useEffect, useState } from "react";
import { UserCard } from "@/components/user-card";
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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const usersPerPage = 6; // Number of users per page

  const getUsers = useCallback(async () => {
    try {
      const usersResponse = await fetch("https://api.escuelajs.co/api/v1/users");
      const usersData = await usersResponse.json();

      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for filtered users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Add the Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="pt-20 p-3">
        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        {/* User grid */}
        <div className="grid grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <UserCard
              key={user.id}
              userName={user.name}
              email={user.email}
              avatar={user.avatar}
              id={user.id} // Pass the ID for navigation
            />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
