import Link from "next/link";

import { StudentPagination } from "./StudentPagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";

type Student = {
  id: string;
  registrationNumber: string;
  name: string;
  fatherName: string | null;
  status: string;
};

interface StudentTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
}

export function StudentTable({
  students,
  currentPage,
  totalPages,
}: StudentTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student List</CardTitle>

        <CardDescription>
          View and manage all students in your school.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Father Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground"
                >
                  No students found.
                  <br />
                  Import an Excel file or add a student manually.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registrationNumber}</TableCell>

                  <TableCell>{student.name}</TableCell>

                  <TableCell>
                    {student.fatherName ?? "-"}
                  </TableCell>

                  <TableCell>{student.status}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link
                        href={`/dashboard/people/students/${student.id}`}
                      >
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <StudentPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </Card>
  );
}