"use client";

import { useState } from "react";

export interface ExamRules {
  payment?: {
    required?: boolean;
    minimumCompletionPercentage?: number;
  };

  attendance?: {
    required?: boolean;
    minimumPercentage?: number;
    scope?: string;
  };

  theory?: {
    required?: boolean;
    mustPass?: boolean;
  };

  practical?: {
    required?: boolean;
    mustPass?: boolean;
  };

  certificate?: {
    required?: boolean;
    fee?: number;
  };

  grading?: Record<
    string,
    {
      minimum: number;
      point: number;
    }
  >;
}

interface ExamRuleEditorProps {
  initialRules?: ExamRules;
  loading?: boolean;
  onSave: (rules: ExamRules) => void;
}

const DEFAULT_RULES: ExamRules = {
  payment: {
    required: true,
    minimumCompletionPercentage: 100,
  },

  attendance: {
    required: true,
    minimumPercentage: 20,
    scope: "EVERY_COURSE",
  },

  theory: {
    required: true,
    mustPass: true,
  },

  practical: {
    required: true,
    mustPass: true,
  },

  certificate: {
    required: true,
    fee: 500,
  },

  grading: {
    O: {
      minimum: 90,
      point: 10,
    },

    "A+": {
      minimum: 80,
      point: 9,
    },

    A: {
      minimum: 70,
      point: 8,
    },

    "B+": {
      minimum: 60,
      point: 7,
    },

    B: {
      minimum: 50,
      point: 6,
    },

    C: {
      minimum: 40,
      point: 5,
    },
  },
};

export function ExamRuleEditor({
  initialRules,
  loading = false,
  onSave,
}: ExamRuleEditorProps) {
  const [rules, setRules] =
    useState<ExamRules>(
      initialRules ?? DEFAULT_RULES,
    );

  function update(
    updater: (
      current: ExamRules,
    ) => ExamRules,
  ) {
    setRules((current) =>
      updater(current),
    );
  }

  return (
    <div className="space-y-6 rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Examination Rules
        </h2>

        <p className="text-sm text-muted-foreground">
          Configure eligibility, passing and
          grading rules.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="font-medium">
          Payment
        </h3>

        <Toggle
          label="Payment Required"
          checked={
            rules.payment?.required ?? true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              payment: {
                ...r.payment,
                required: checked,
              },
            }))
          }
        />

        <NumberField
          label="Minimum Payment Completion %"
          value={
            rules.payment
              ?.minimumCompletionPercentage ??
            100
          }
          onChange={(value) =>
            update((r) => ({
              ...r,
              payment: {
                ...r.payment,
                minimumCompletionPercentage:
                  value,
              },
            }))
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-medium">
          Attendance
        </h3>

        <Toggle
          label="Attendance Required"
          checked={
            rules.attendance?.required ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              attendance: {
                ...r.attendance,
                required: checked,
              },
            }))
          }
        />

        <NumberField
          label="Minimum Attendance %"
          value={
            rules.attendance
              ?.minimumPercentage ?? 20
          }
          onChange={(value) =>
            update((r) => ({
              ...r,
              attendance: {
                ...r.attendance,
                minimumPercentage:
                  value,
              },
            }))
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-medium">
          Theory
        </h3>

        <Toggle
          label="Theory Required"
          checked={
            rules.theory?.required ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              theory: {
                ...r.theory,
                required: checked,
              },
            }))
          }
        />

        <Toggle
          label="Theory Must Pass"
          checked={
            rules.theory?.mustPass ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              theory: {
                ...r.theory,
                mustPass: checked,
              },
            }))
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-medium">
          Practical
        </h3>

        <Toggle
          label="Practical Required"
          checked={
            rules.practical?.required ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              practical: {
                ...r.practical,
                required: checked,
              },
            }))
          }
        />

        <Toggle
          label="Practical Must Pass"
          checked={
            rules.practical?.mustPass ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              practical: {
                ...r.practical,
                mustPass: checked,
              },
            }))
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-medium">
          Certificate
        </h3>

        <Toggle
          label="Certificate Required"
          checked={
            rules.certificate?.required ??
            true
          }
          onChange={(checked) =>
            update((r) => ({
              ...r,
              certificate: {
                ...r.certificate,
                required: checked,
              },
            }))
          }
        />

        <NumberField
          label="Certificate Fee"
          value={
            rules.certificate?.fee ??
            500
          }
          onChange={(value) =>
            update((r) => ({
              ...r,
              certificate: {
                ...r.certificate,
                fee: value,
              },
            }))
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-medium">
          Grading
        </h3>

        {Object.entries(
          rules.grading ?? {},
        ).map(([grade, rule]) => (
          <div
            key={grade}
            className="grid grid-cols-3 gap-3"
          >
            <input
              value={grade}
              readOnly
              className="rounded-md border bg-muted px-3 py-2"
            />

            <input
              type="number"
              value={rule.minimum}
              onChange={(e) =>
                update((r) => ({
                  ...r,
                  grading: {
                    ...r.grading,
                    [grade]: {
                      ...rule,
                      minimum:
                        Number(
                          e.target.value,
                        ),
                    },
                  },
                }))
              }
              className="rounded-md border px-3 py-2"
              placeholder="Minimum %"
            />

            <input
              type="number"
              value={rule.point}
              onChange={(e) =>
                update((r) => ({
                  ...r,
                  grading: {
                    ...r.grading,
                    [grade]: {
                      ...rule,
                      point:
                        Number(
                          e.target.value,
                        ),
                    },
                  },
                }))
              }
              className="rounded-md border px-3 py-2"
              placeholder="Point"
            />
          </div>
        ))}
      </section>

      <button
        type="button"
        disabled={loading}
        onClick={() => onSave(rules)}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? "Saving Rules..."
          : "Save Examination Rules"}
      </button>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="h-4 w-4"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm">
        {label}
      </span>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-32 rounded-md border px-3 py-2"
      />
    </label>
  );
}