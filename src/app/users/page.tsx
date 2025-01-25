"use client";

import { useCallback, useEffect, useState } from "react";
import { UserCard } from "@/components/user-card";
import { Navbar } from "@/components/ui/navbar";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newUser, setNewUser] = useState<Omit<User, "id" | "creationAt" | "updatedAt">>({
    email: "",
    name: "",
    role: "",
    avatar: "",
  });

  const usersPerPage = 6; // Number of users per page

  const getUsers = useCallback(async () => {
    try {
      const usersResponse = await fetch("https://api.escuelajs.co/api/v1/users");
      const usersData = await usersResponse.json();

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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

  const handleCreateUser = async () => {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const createdUser = await response.json();

      // Update users list after creation
      setUsers((prev) => [...prev, createdUser]);
      setIsModalOpen(false);
      setNewUser({ email: "", name: "", role: "", avatar: "" }); // Reset form
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 p-3 max-w-6xl mx-auto">
        {/* Search bar and create button */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Créer un nouvel utilisateur
          </button>
        </div>

        {/* User grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <UserCard
              key={user.id}
              userName={user.name}
              email={user.email}
              avatar={user.avatar}
              id={user.id}
            />
          ))}
        </div>

        {/* Pagination */}
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

        {/* Modal for creating new user */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Créer un nouvel utilisateur</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateUser();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                  <input
                    type="text"
                    value={newUser.avatar}
                    onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
