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

interface UserCardProps {
  userName: string;
  email: string;
  avatar: string;
  id: string;
}

export const UserCard: FC<UserCardProps> = ({ userName, email, avatar, id }) => {
  return (
    <Link href={`/users/${id}`}>
      <Card className="flex flex-col w-[350px] items-center justify-center border-black cursor-pointer hover:shadow-lg transition-shadow">
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
      </Card>
    </Link>
  );
};
