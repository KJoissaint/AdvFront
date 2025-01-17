import * as React from "react"
import { FC } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  userName: string;
  email: string;
  avatar: string;
}

export const UserCard: FC<UserCardProps> = (props) => {
  const { userName, email, avatar } = props;
  return (
    <Card className="flex flex-col w-[350px] items-center justify-center border-black">
      <CardHeader>
        <CardTitle>{userName}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  )
}
