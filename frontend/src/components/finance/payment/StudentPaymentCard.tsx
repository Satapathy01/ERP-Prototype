"use client";

import type { ReactNode } from "react";

import { format } from "date-fns";
import {
  CalendarDays,
  GraduationCap,
  Hash,
  User,
  Clock3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface StudentPaymentStudent {
  name?: string | null;
  registrationNumber?: string | null;
  photo?: string | null;
  photoUrl?: string | null;
}

interface StudentPaymentCourse {
  name?: string | null;
  durationMonths?: number | null;
  admissionFee?: number | string | null;
  monthlyFee?: number | string | null;
  certificateFee?: number | string | null;

  feeSchedules?: Array<{
    id: string;
    title: string;
    isActive?: boolean;
  }>;
}

interface StudentPaymentBatch {
  id?: string;
  name?: string | null;
}

export interface StudentPaymentAdmission {
  id: string;

  admissionNumber?: string | null;

  status?: string | null;

  createdAt?: Date | string | null;

  student?: StudentPaymentStudent | null;

  course?: StudentPaymentCourse | null;

  batch?: StudentPaymentBatch | string | null;
}

interface StudentPaymentCardProps {
  admission: StudentPaymentAdmission | null;
}

export default function StudentPaymentCard({
  admission,
}: StudentPaymentCardProps) {
  const student = admission?.student;
  const course = admission?.course;

  const studentPhoto =
    student?.photoUrl ??
    student?.photo ??
    "";

  const studentInitial =
    student?.name
      ?.charAt(0)
      ?.toUpperCase() ?? "S";

  const batchName =
    typeof admission?.batch === "object"
      ? admission.batch?.name
      : admission?.batch;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />

          Student Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* -------------------------------------------------- */}
        {/* Student */}
        {/* -------------------------------------------------- */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 border">
            <AvatarImage
              src={studentPhoto}
              alt={student?.name ?? "Student"}
            />

            <AvatarFallback>
              {studentInitial}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-xl font-bold">
              {student?.name ?? "Student Name"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {student?.registrationNumber ??
                "Registration Number"}
            </p>

            <Badge>
              {admission?.status ?? "Active"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* -------------------------------------------------- */}
        {/* Admission Details */}
        {/* -------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem
            icon={
              <Hash className="h-4 w-4" />
            }
            label="Admission No"
            value={
              admission?.admissionNumber
            }
          />

          <InfoItem
            icon={
              <GraduationCap className="h-4 w-4" />
            }
            label="Course"
            value={course?.name}
          />

          <InfoItem
            icon={
              <Clock3 className="h-4 w-4" />
            }
            label="Duration"
            value={
              course?.durationMonths != null
                ? `${course.durationMonths} Months`
                : "-"
            }
          />

          <InfoItem
            icon={
              <CalendarDays className="h-4 w-4" />
            }
            label="Admission Date"
            value={
              admission?.createdAt
                ? format(
                    new Date(
                      admission.createdAt,
                    ),
                    "dd MMM yyyy",
                  )
                : "-"
            }
          />

          <InfoItem
            icon={
              <User className="h-4 w-4" />
            }
            label="Batch"
            value={batchName}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------- */
/* Info Item */
/* -------------------------------------------------- */

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="font-medium">
        {value || "-"}
      </p>
    </div>
  );
}