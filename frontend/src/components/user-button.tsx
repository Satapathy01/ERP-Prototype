"use client";

import { useEffect, useState } from "react";
import {
  CircleUserRoundIcon,
  LogOutIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Button } from "~/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "~/components/ui/avatar";

import { ThemeSegmentControl } from "./theme-segment-control";

import { useRouter } from "next/navigation";


type CurrentUser = {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: string;
};

export function UserButton() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) return;

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    }

    loadUser();
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() ?? "?";

  async function handleLogout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    router.replace("/login");
    router.refresh();
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 space-y-1">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.name ?? "Loading..."}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuLabel className="font-normal">
          <ThemeSegmentControl />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CircleUserRoundIcon />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}