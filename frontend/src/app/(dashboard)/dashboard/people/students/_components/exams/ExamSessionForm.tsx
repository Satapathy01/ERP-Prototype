"use client";

import { FormEvent, useState } from "react";

interface RuleSetOption {
  id: string;
  name: string;
  version: number;
  description?: string | null;
  isActive: boolean;
}

interface ExamSessionFormProps {
  ruleSets: RuleSetOption[];

  initialValues?: {
    name?: string;
    code?: string;
    academicYear?: string;
    ruleSetId?: string;
    startsAt?: string;
    endsAt?: string;
  };

  loading?: boolean;

  onSubmit: (values: {
    name: string;
    code?: string;
    academicYear?: string;
    ruleSetId: string;
    startsAt?: string;
    endsAt?: string;
  }) => void | Promise<void>;

  onCancel?: () => void;
}

export function ExamSessionForm({
  ruleSets,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}: ExamSessionFormProps) {
  const [name, setName] = useState(
    initialValues?.name ?? "",
  );

  const [code, setCode] = useState(
    initialValues?.code ?? "",
  );

  const [academicYear, setAcademicYear] =
    useState(
      initialValues?.academicYear ?? "",
    );

  const [ruleSetId, setRuleSetId] =
    useState(
      initialValues?.ruleSetId ?? "",
    );

  const [startsAt, setStartsAt] =
    useState(
      initialValues?.startsAt ?? "",
    );

  const [endsAt, setEndsAt] =
    useState(
      initialValues?.endsAt ?? "",
    );

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!ruleSetId) {
      return;
    }

    await onSubmit({
      name: name.trim(),

      code:
        code.trim() || undefined,

      academicYear:
        academicYear.trim() || undefined,

      ruleSetId,

      startsAt:
        startsAt || undefined,

      endsAt:
        endsAt || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          Examination Session
        </h2>

        <p className="text-sm text-muted-foreground">
          Create an examination session and
          associate it with an examination
          rule set.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Session Name"
          value={name}
          onChange={setName}
          required
          placeholder="Final Examination 2026"
        />

        <Field
          label="Code"
          value={code}
          onChange={setCode}
          placeholder="EXAM-2026-FINAL"
        />

        <Field
          label="Academic Year"
          value={academicYear}
          onChange={setAcademicYear}
          placeholder="2026-27"
        />

        {/* Rule Set */}
        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Examination Rule Set
          </span>

          <select
            value={ruleSetId}
            required
            onChange={(event) =>
              setRuleSetId(
                event.target.value,
              )
            }
            className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2"
          >
            <option value="">
              Select rule set
            </option>

            {ruleSets.map((ruleSet) => (
              <option
                key={ruleSet.id}
                value={ruleSet.id}
              >
                {ruleSet.name} — v
                {ruleSet.version}
                {ruleSet.isActive
                  ? " (Active)"
                  : ""}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Start Date"
          type="datetime-local"
          value={startsAt}
          onChange={setStartsAt}
        />

        <Field
          label="End Date"
          type="datetime-local"
          value={endsAt}
          onChange={setEndsAt}
        />
      </div>

      {ruleSets.length === 0 && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          No examination rule sets are available.
          Create an examination rule set before
          creating a session.
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            ruleSets.length === 0
          }
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Session"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
      />
    </label>
  );
}