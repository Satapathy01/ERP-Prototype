"use client";

import { useState } from "react";
import type { Student } from "@prisma/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import StudentForm from "./StudentForm";

import { createStudent } from "@/modules/student/actions/create-student";
import { updateStudent } from "@/modules/student/actions/update-student";

import type { CreateStudentInput } from "@/modules/student/student.schema";

interface StudentDialogProps {
  schoolId: string;
  student?: Student;
  trigger?: React.ReactNode;
}

export default function StudentDialog({
   schoolId,
  student,
  courseId,
  trigger,
}: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateStudentInput) => {
    try {
      setLoading(true);

      const result = student
        ? await updateStudent(student.id, schoolId, values)
        : await createStudent(schoolId, values);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const defaultValues: Partial<CreateStudentInput> | undefined = student
    ? {
        name: student.name,

        fatherName: student.fatherName ?? "",
        motherName: student.motherName ?? "",

        gender: student.gender ?? undefined,

        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.toISOString().split("T")[0]
          : "",

        bloodGroup: student.bloodGroup ?? "",

        studentPhone: student.studentPhone ?? "",
        parentPhone: student.parentPhone ?? "",

        email: student.email ?? "",

        address: student.address ?? "",
        city: student.city ?? "",
        state: student.state ?? "",
        pinCode: student.pinCode ?? "",

        aadhaarNumber: student.aadhaarNumber ?? "",

        photoUrl: student.photoUrl ?? "",

        status: student.status,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Create Student
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {student ? "Edit Student" : "Create Student"}
          </DialogTitle>
        </DialogHeader>

        <StudentForm
          loading={loading}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}