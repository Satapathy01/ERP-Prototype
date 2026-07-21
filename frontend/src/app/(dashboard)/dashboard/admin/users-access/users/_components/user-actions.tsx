"use client";

import { MoreHorizontal, KeyRound } from "lucide-react";
import { UserRole } from "@prisma/client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";

interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  function handleResetPassword() {
    // TODO: Implement reset password
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <EditUserDialog user={user} />

        <DropdownMenuItem onClick={handleResetPassword}>
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Reset Password</span>
        </DropdownMenuItem>

        <DeleteUserDialog user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}