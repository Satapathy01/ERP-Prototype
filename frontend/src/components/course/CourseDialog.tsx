"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import CourseForm from "./CourseForm";

import { createCourse } from "@/modules/courses/actions/create-course";
import { updateCourse } from "@/modules/courses/actions/update-course";
import { toast } from "sonner";

import type { CourseSchema } from "@/modules/courses/actions/schemas/course.schema";

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

interface CourseDialogProps {
  schoolId: string;
  course?: SerializableCourse;
  trigger?: React.ReactNode;
}

export default function CourseDialog({
  schoolId,
  course,
  trigger,
}: CourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const isEdit = !!course;

  async function handleSubmit(values: CourseSchema) {
    startTransition(async () => {
      const result = isEdit
        ? await updateCourse(course.id, schoolId, values)
        : await createCourse(schoolId, values);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            {isEdit ? "Edit Course" : "Add Course"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Course" : "Add Course"}
          </DialogTitle>
        </DialogHeader>

        <CourseForm
          loading={pending}
          defaultValues={course ?? undefined}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}