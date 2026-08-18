"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, StudentStatus } from "@prisma/client";

import {
  createStudentSchema,
  type CreateStudentInput,
} from "@/modules/student/student.schema";

interface StudentFormProps {
  defaultValues?: Partial<CreateStudentInput>;
  loading?: boolean;
  onSubmit: SubmitHandler<CreateStudentInput>;
}

export default function StudentForm({
  defaultValues,
  loading = false,
  onSubmit,
}: StudentFormProps) {
  const form = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      fatherName: "",
      motherName: "",
      gender: undefined,
      dateOfBirth: "",
      bloodGroup: "",
      studentPhone: "",
      parentPhone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      aadhaarNumber: "",
      photoUrl: "",
      status: StudentStatus.ACTIVE,
      ...defaultValues,
    },
    mode: "onChange",
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      {/* Student Name */}
      <div>
        <label>Student Name</label>
        <input
          {...form.register("name")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Father Name */}
      <div>
        <label>Father Name</label>
        <input
          {...form.register("fatherName")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Mother Name */}
      <div>
        <label>Mother Name</label>
        <input
          {...form.register("motherName")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Gender */}
      <div>
        <label>Gender</label>
        <select
          {...form.register("gender")}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="">Select Gender</option>
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
          <option value={Gender.OTHER}>Other</option>
        </select>
      </div>

      {/* DOB */}
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          {...form.register("dateOfBirth")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Blood Group */}
      <div>
        <label>Blood Group</label>
        <input
          {...form.register("bloodGroup")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Student Phone */}
      <div>
        <label>Student Phone</label>
        <input
          {...form.register("studentPhone")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Parent Phone */}
      <div>
        <label>Parent Phone</label>
        <input
          {...form.register("parentPhone")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Email */}
      <div>
        <label>Email</label>
        <input
          type="email"
          {...form.register("email")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Address */}
      <div>
        <label>Address</label>
        <textarea
          {...form.register("address")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* City */}
      <div>
        <label>City</label>
        <input
          {...form.register("city")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* State */}
      <div>
        <label>State</label>
        <input
          {...form.register("state")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* PIN */}
      <div>
        <label>PIN Code</label>
        <input
          {...form.register("pinCode")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Aadhaar */}
      <div>
        <label>Aadhaar Number</label>
        <input
          {...form.register("aadhaarNumber")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Photo URL */}
      <div>
        <label>Photo URL</label>
        <input
          {...form.register("photoUrl")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Status */}
      <div>
        <label>Status</label>
        <select
          {...form.register("status")}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value={StudentStatus.ACTIVE}>ACTIVE</option>
          <option value={StudentStatus.INACTIVE}>INACTIVE</option>
          <option value={StudentStatus.ALUMNI}>ALUMNI</option>
          <option value={StudentStatus.SUSPENDED}>SUSPENDED</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Student"}
      </button>
    </form>
  );
}