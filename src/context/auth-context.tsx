"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define types for the user
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/users");
      const users = await response.json();

      const foundUser = users.find((u: any) => u.email === email);

      if (foundUser) {
        if (foundUser.password !== password) {
          throw new Error("Invalid password");
        }

        const loggedUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };

        localStorage.setItem("user", JSON.stringify(loggedUser)); // Store user data
        setUser(loggedUser);
        router.push("/"); // Redirect to home page
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
