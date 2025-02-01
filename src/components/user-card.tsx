import * as React from "react";
import { FC } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

interface UserCardProps {
  userName: string;
  email: string;
  avatar: string;
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ userName, email, avatar, id, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col w-[350px] items-center justify-center border-black cursor-pointer hover:shadow-lg transition-shadow relative">
      <Link href={`/users/${id}`} className="w-full flex flex-col items-center">
        <CardHeader>
          <CardTitle>{userName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Avatar>
            <AvatarImage src={avatar} loading="lazy" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </CardContent>
      </Link>

      {/* Icons for Edit & Delete */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {/* Edit Icon */}
        <button onClick={() => onEdit(id)} className="p-1 rounded-md hover:bg-gray-200">
          <Pencil1Icon className="w-5 h-5 text-black" />
        </button>
        {/* Delete Icon */}
        <button onClick={() => onDelete(id)} className="p-1 rounded-md hover:bg-gray-200">
          <TrashIcon className="w-5 h-5 text-black" />
        </button>
      </div>
    </Card>
  );
};
