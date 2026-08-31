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

      /*
       * Keep any existing values exactly as they are.
       * This also allows StudentDialog to provide any additional
       * fields that already exist in your schema.
       */
      ...defaultValues,
    },

    mode: "onChange",
  });

  const handleValidSubmit: SubmitHandler<CreateStudentInput> = async (
    values
  ) => {
    /*
     * Do not modify the values the user entered.
     * Submit them exactly as collected by react-hook-form.
     */
    await onSubmit(values);
  };

  const handleInvalidSubmit = () => {
    const errors = form.formState.errors;

    console.error("Student validation errors:", errors);

    const firstError = Object.keys(errors)[0] as keyof CreateStudentInput;

    if (firstError) {
      form.setFocus(firstError);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(
        handleValidSubmit,
        handleInvalidSubmit
      )}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Scrollable fields */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 py-2 pb-6">

          {/* Student Name */}
          <div>
            <label className="mb-1 block">Student Name</label>

            <input
              {...form.register("name")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Father Name */}
          <div>
            <label className="mb-1 block">Father Name</label>

            <input
              {...form.register("fatherName")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.fatherName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.fatherName.message}
              </p>
            )}
          </div>

          {/* Mother Name */}
          <div>
            <label className="mb-1 block">Mother Name</label>

            <input
              {...form.register("motherName")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.motherName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.motherName.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1 block">Gender</label>

            <select
              {...form.register("gender")}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>

            {form.formState.errors.gender && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="mb-1 block">Date of Birth</label>

            <input
              type="date"
              {...form.register("dateOfBirth")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="mb-1 block">Blood Group</label>

            <input
              {...form.register("bloodGroup")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.bloodGroup && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/* Student Phone */}
          <div>
            <label className="mb-1 block">Student Phone</label>

            <input
              {...form.register("studentPhone")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.studentPhone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.studentPhone.message}
              </p>
            )}
          </div>

          {/* Parent Phone */}
          <div>
            <label className="mb-1 block">Parent Phone</label>

            <input
              {...form.register("parentPhone")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.parentPhone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.parentPhone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block">Email</label>

            <input
              type="email"
              {...form.register("email")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block">Address</label>

            <textarea
              {...form.register("address")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="mb-1 block">City</label>

            <input
              {...form.register("city")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.city && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.city.message}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="mb-1 block">State</label>

            <input
              {...form.register("state")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.state && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.state.message}
              </p>
            )}
          </div>

          {/* PIN Code */}
          <div>
            <label className="mb-1 block">PIN Code</label>

            <input
              {...form.register("pinCode")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.pinCode && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.pinCode.message}
              </p>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label className="mb-1 block">Aadhaar Number</label>

            <input
              {...form.register("aadhaarNumber")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.aadhaarNumber && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.aadhaarNumber.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="mb-1 block">Photo URL</label>

            <input
              {...form.register("photoUrl")}
              className="w-full rounded-md border px-3 py-2"
            />

            {form.formState.errors.photoUrl && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.photoUrl.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block">Status</label>

            <select
              {...form.register("status")}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value={StudentStatus.ACTIVE}>ACTIVE</option>
              <option value={StudentStatus.INACTIVE}>INACTIVE</option>
              <option value={StudentStatus.ALUMNI}>ALUMNI</option>
              <option value={StudentStatus.SUSPENDED}>SUSPENDED</option>
            </select>

            {form.formState.errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Save button */}
      <div className="shrink-0 border-t bg-background pt-4">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Student"}
        </button>
      </div>
    </form>
  );
}