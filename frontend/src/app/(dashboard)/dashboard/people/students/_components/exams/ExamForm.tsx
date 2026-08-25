"use client";

import { FormEvent, useState } from "react";

export interface ExamFormValues {
  sessionId: string;
  courseId: string;
  name: string;
  code?: string;
  type: "THEORY" | "PRACTICAL";
  maxMarks: number;
  passMarks: number;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  instructions?: string;
}

interface ExamFormProps {
  sessionId: string;
  courses: {
    id: string;
    name: string;
    code?: string;
  }[];

  initialValues?: Partial<ExamFormValues>;

  loading?: boolean;

  onSubmit: (
    values: ExamFormValues,
  ) => void;
}

export function ExamForm({
  sessionId,
  courses,
  initialValues,
  loading = false,
  onSubmit,
}: ExamFormProps) {
  const [courseId, setCourseId] =
    useState(initialValues?.courseId ?? "");

  const [name, setName] =
    useState(initialValues?.name ?? "");

  const [code, setCode] =
    useState(initialValues?.code ?? "");

  const [type, setType] =
    useState<"THEORY" | "PRACTICAL">(
      initialValues?.type ?? "THEORY",
    );

  const [maxMarks, setMaxMarks] =
    useState(
      initialValues?.maxMarks?.toString() ??
        "100",
    );

  const [passMarks, setPassMarks] =
    useState(
      initialValues?.passMarks?.toString() ??
        "40",
    );

  const [examDate, setExamDate] =
    useState(initialValues?.examDate ?? "");

  const [startTime, setStartTime] =
    useState(initialValues?.startTime ?? "");

  const [endTime, setEndTime] =
    useState(initialValues?.endTime ?? "");

  const [venue, setVenue] =
    useState(initialValues?.venue ?? "");

  const [instructions, setInstructions] =
    useState(
      initialValues?.instructions ?? "",
    );

  function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    onSubmit({
      sessionId,
      courseId,
      name: name.trim(),
      code: code.trim() || undefined,
      type,
      maxMarks: Number(maxMarks),
      passMarks: Number(passMarks),
      examDate: examDate || undefined,
      startTime:
        startTime || undefined,
      endTime: endTime || undefined,
      venue: venue.trim() || undefined,
      instructions:
        instructions.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-xl border bg-white p-6"
    >
      <h2 className="text-lg font-semibold">
        Examination
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Course
          </span>

          <select
            value={courseId}
            required
            onChange={(e) =>
              setCourseId(e.target.value)
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">
              Select course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.name}
                {course.code
                  ? ` (${course.code})`
                  : ""}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Exam Name"
          value={name}
          onChange={setName}
          required
        />

        <Input
          label="Exam Code"
          value={code}
          onChange={setCode}
        />

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Type
          </span>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                  | "THEORY"
                  | "PRACTICAL",
              )
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="THEORY">
              Theory
            </option>

            <option value="PRACTICAL">
              Practical
            </option>
          </select>
        </label>

        <Input
          label="Maximum Marks"
          type="number"
          value={maxMarks}
          onChange={setMaxMarks}
          required
        />

        <Input
          label="Pass Marks"
          type="number"
          value={passMarks}
          onChange={setPassMarks}
          required
        />

        <Input
          label="Exam Date"
          type="date"
          value={examDate}
          onChange={setExamDate}
        />

        <Input
          label="Start Time"
          type="time"
          value={startTime}
          onChange={setStartTime}
        />

        <Input
          label="End Time"
          type="time"
          value={endTime}
          onChange={setEndTime}
        />

        <Input
          label="Venue"
          value={venue}
          onChange={setVenue}
        />
      </div>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium">
          Instructions
        </span>

        <textarea
          value={instructions}
          onChange={(e) =>
            setInstructions(e.target.value)
          }
          rows={4}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Exam"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium">
        {label}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-md border px-3 py-2"
      />
    </label>
  );
}