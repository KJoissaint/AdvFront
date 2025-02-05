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
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const usersPerPage = 6;

  const { data: users = [], refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://api.escuelajs.co/api/v1/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: Omit<User, "id" | "creationAt" | "updatedAt">) => {
      const res = await fetch("https://api.escuelajs.co/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          avatar: user.avatar.trim() || "random.com",
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

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
        oldUsers?.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
    },
  });

  const handleEditUser = (id: string) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setEditingUser(userToEdit);
    }
  };

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
            Create New User
          </button>
        </div>

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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New User</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createUserMutation.mutate(newUser);
                }}
              >
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required placeholder="Name" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required placeholder="Email" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required placeholder="Password" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required placeholder="Role" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <input type="text" value={newUser.avatar} onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })} placeholder="Avatar URL (optional)" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 mt-4">Create</button>
              </form>
            </div>
          </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUserMutation.mutate(editingUser);
                }}
              >
                <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required placeholder="Name" className="w-full px-4 py-2 border rounded-lg text-white" />
                <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required placeholder="Email" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <input type="text" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} required placeholder="Role" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <input type="text" value={editingUser.avatar} onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })} placeholder="Avatar URL (optional)" className="w-full px-4 py-2 border rounded-lg text-white mt-2" />
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 mt-4">Save Changes</button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4 ml-2">Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
