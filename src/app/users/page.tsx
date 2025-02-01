"use client";

import { useState } from "react";
import { UserCard } from "@/components/user-card";
import { Navbar } from "@/components/ui/navbar";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
  password: string;
}

export default function UsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}

function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "creationAt" | "updatedAt">>({
    email: "",
    name: "",
    role: "",
    avatar: "",
    password: "",
  });

  const usersPerPage = 6;

  // Récupération des utilisateurs avec React Query
  const { data: users = [], refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://api.escuelajs.co/api/v1/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Création d'un utilisateur
  const createUserMutation = useMutation({
    mutationFn: async (user: Omit<User, "id" | "creationAt" | "updatedAt">) => {
      const res = await fetch("https://api.escuelajs.co/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          avatar: user.avatar.trim() || "random.com", // Défaut si vide
        }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    onSuccess: (createdUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => [...(oldUsers || []), createdUser]);
      setIsModalOpen(false);
      setNewUser({ email: "", name: "", role: "", password: "", avatar: "" });
    },
  });

  // Suppression d'un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Édition (Mock)
  const handleEditUser = (id: string) => {
    alert(`Modifier l'utilisateur ${id} (À implémenter)`);
  };

  // Filtrage et pagination
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />

      <div className="pt-20 p-3 max-w-6xl mx-auto">
        {/* Barre de recherche et bouton d'ajout */}
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

        {/* Liste des utilisateurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <UserCard
              key={user.id}
              userName={user.name}
              email={user.email}
              avatar={user.avatar}
              id={user.id}
              onEdit={handleEditUser}
              onDelete={() => deleteUserMutation.mutate(user.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Modal pour la création */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Créer un nouvel utilisateur</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createUserMutation.mutate(newUser);
                }}
              >
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required placeholder="Nom" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required placeholder="Email" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required placeholder="Password" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required placeholder="Role" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="text" value={newUser.avatar} onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })} placeholder="Avatar URL (optionnel)" className="w-full px-4 py-2 border rounded-lg text-white" />
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 mt-4">Créer</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
