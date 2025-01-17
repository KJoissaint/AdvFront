"use client";

import {useCallback, useEffect, useState} from "react";
import { UserCard } from "@/components/user-card";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

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

  return (
    <div className="p-3 grid grid-cols-2 gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          userName={user.name}
          email={user.email}
          avatar={user.avatar}
        />
      ))}
    </div>
  );
}
