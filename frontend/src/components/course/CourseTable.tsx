"use client";

import type { Course } from "@prisma/client";

import { DataTable } from "@/components/data-table/DataTable";
import { getCourseColumns } from "@/components/data-table/columns/course-columns";

interface CourseTableProps {
  schoolId: string;
  courses: Course[];
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