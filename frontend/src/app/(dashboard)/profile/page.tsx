import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { getCurrentUser } from "~/modules/auth/current-user";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Unable to load profile
            </CardTitle>

            <CardDescription>
              Your authentication session could not
              be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <main className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          My Profile
        </h1>

        <p className="text-muted-foreground">
          View your account and authentication details.
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* User Summary */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold">
                  {user.name}
                </h2>

                <Badge variant="secondary">
                  {user.role}
                </Badge>
              </div>

              <p className="text-muted-foreground">
                {user.email}
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />

                {user.isActive
                  ? "Active account"
                  : "Inactive account"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Account Information
          </CardTitle>

          <CardDescription>
            Information associated with your ERP account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <User className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Full Name
                </p>

                <p className="font-medium">
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Email Address
                </p>

                <p className="break-all font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Role
                </p>

                <p className="font-medium">
                  {user.role}
                </p>
              </div>
            </div>

            {/* School */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Building2 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  School ID
                </p>

                <p className="break-all font-medium">
                  {user.schoolId}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <User className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  User ID
                </p>

                <p className="break-all font-medium">
                  {user.id}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Account Status
                </p>

                <p className="font-medium">
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}