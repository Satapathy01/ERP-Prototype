"use client";

import type { Student } from "@prisma/client";

import { DataTable } from "@/components/data-table/DataTable";
import { getStudentColumns } from "@/components/data-table/columns/student-columns";

interface StudentTableProps {
  students: Student[];
  schoolId: string;
}

export default function StudentTable({
  students,
  schoolId,
}: StudentTableProps) {
  const columns = getStudentColumns({ schoolId });

  return (
    <DataTable
      columns={columns}
      data={students}
      searchColumn="registrationNumber"
      searchPlaceholder="Search by registration number..."
    />
  );
}