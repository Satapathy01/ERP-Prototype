"use client";

import { ChevronDown, Mail, ShieldCheck } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileProps {
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function UserProfile({
  name,
  email,
  role,
  image,
}: UserProfileProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2 transition-colors hover:bg-muted">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold">{name}</p>

            <p className="text-xs text-muted-foreground">
              {role}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl"
      >
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">{name}</p>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {role}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuItem>
          Change Password
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}