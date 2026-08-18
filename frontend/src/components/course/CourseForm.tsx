"use client";

import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  courseSchema,
  type CourseSchema,
} from "@/modules/courses/actions/schemas/course.schema";

interface CourseFormProps {
  defaultValues?: Partial<CourseSchema>;
  loading?: boolean;
  onSubmit: (
    values: CourseSchema
  ) => void | Promise<void>;
}

export default function CourseForm({
  defaultValues,
  loading = false,
  onSubmit,
}: CourseFormProps) {
  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),

    defaultValues: {
      code: "",
      name: "",
      durationMonths: 1,
      admissionFee: 0,
      monthlyFee: 0,
      installmentCount: 1,
      discount: 0,
      totalFee: 0,
      isActive: true,
      ...defaultValues,
    },

    mode: "onChange",
  });

  const admissionFee =
    useWatch({
      control: form.control,
      name: "admissionFee",
    }) ?? 0;

  const monthlyFee =
    useWatch({
      control: form.control,
      name: "monthlyFee",
    }) ?? 0;

  const installmentCount =
    useWatch({
      control: form.control,
      name: "installmentCount",
    }) ?? 0;

  const discount =
    useWatch({
      control: form.control,
      name: "discount",
    }) ?? 0;

  useEffect(() => {
    const total =
      Number(admissionFee) +
      Number(monthlyFee) *
        Number(installmentCount) -
      Number(discount);

    form.setValue("totalFee", total, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [
    admissionFee,
    monthlyFee,
    installmentCount,
    discount,
    form,
  ]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Shadcn Form Fields will be added next */}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Course"}
      </button>
    </form>
  );
}