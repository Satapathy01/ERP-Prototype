"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { getCourseColumns } from "@/components/data-table/columns/course-columns";

type SerializableCourse = {
  id: string;
  schoolId: string;
  code: string;
  name: string;

  durationMonths: number;
  theoryDurationDays: number;
  practicalDurationDays: number;

  admissionFee: number;
  monthlyFee: number;
  certificateFee: number;
  totalFee: number;

  installmentCount: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};

interface CourseTableProps {
  schoolId: string;
  courses: SerializableCourse[];
}

export default function CourseTable({
  schoolId,
  courses,
}: CourseTableProps) {
  const columns = getCourseColumns({
    schoolId,
  });

  return (
    <DataTable
      columns={columns}
      data={courses}
      searchColumn="name"
      searchPlaceholder="Search courses..."
    />
  );
}