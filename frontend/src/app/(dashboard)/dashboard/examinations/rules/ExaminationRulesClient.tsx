"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  IndianRupee,
  Percent,
  ShieldCheck,
  BookOpenCheck,
  FlaskConical,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { RuleAssistant } from "../../admin/rules/RuleAssistant";

interface ExamRules {
  payment?: {
    required?: boolean;
    minimumCompletionPercentage?: number;
  };

  attendance?: {
    required?: boolean;
    minimumPercentage?: number;
    scope?: "EVERY_COURSE" | "OVERALL";
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
}

interface RuleSet {
  id: string;
  name: string;
  description?: string | null;
  version: number;
  rules: ExamRules;
  isActive: boolean;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  createdAt?: string;
}

interface RulesResponse {
  success: boolean;
  message?: string;
  rules?: RuleSet[];
}

export default function ExaminationRulesClient() {
  const [ruleSets, setRuleSets] =
    useState<RuleSet[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  async function loadRules() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/exams/rules",
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as RulesResponse;

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to load examination rules.",
        );
      }

      setRuleSets(data.rules ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load examination rules.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadRules();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, []);

  const activeRuleSet = useMemo(
    () =>
      ruleSets.find(
        (ruleSet) => ruleSet.isActive,
      ) ?? null,
    [ruleSets],
  );

  const history = useMemo(
    () =>
      ruleSets
        .filter(
          (ruleSet) =>
            ruleSet.id !==
            activeRuleSet?.id,
        )
        .sort(
          (a, b) =>
            b.version - a.version,
        ),
    [ruleSets, activeRuleSet],
  );

  return (
    <main className="space-y-6 p-6">
      {/* Header */}

      <div>
        <Link
          href="/dashboard/examinations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Examinations
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-orange-500">
            Academic Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Examination Rules
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage the rules that determine examination
            eligibility, completion, and certification.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Active Rule Set */}

      {loading ? (
        <div className="rounded-2xl border bg-white p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-72 rounded bg-muted" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="h-24 rounded-xl bg-muted" />
              <div className="h-24 rounded-xl bg-muted" />
              <div className="h-24 rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      ) : activeRuleSet ? (
        <ActiveRuleCard ruleSet={activeRuleSet} />
      ) : (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="font-semibold">
            No active examination rules
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Use the Rule Assistant below to create
            the first examination rule set.
          </p>
        </div>
      )}

      {/* Rule Assistant */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Rule Assistant
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Describe changes to the examination rules
            using natural language.
          </p>
        </div>

        <RuleAssistant />
      </section>

      {/* History */}

      {!loading && history.length > 0 && (
        <section className="rounded-2xl border bg-white">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">
              Rule History
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Previous versions are preserved for
              historical examination records.
            </p>
          </div>

          <div className="divide-y">
            {history.map((ruleSet) => (
              <div
                key={ruleSet.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">
                      {ruleSet.name}
                    </p>

                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      v{ruleSet.version}
                    </span>
                  </div>

                  {ruleSet.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ruleSet.description}
                    </p>
                  )}
                </div>

                <span className="text-sm text-muted-foreground">
                  Historical
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Active Rule Card                                                           */
/* -------------------------------------------------------------------------- */

function ActiveRuleCard({
  ruleSet,
}: {
  ruleSet: RuleSet;
}) {
  const rules = ruleSet.rules;

  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      {/* Rule Set Header */}

      <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {ruleSet.name}
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle2 className="size-3.5" />
              Active
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Version {ruleSet.version}
            {ruleSet.description
              ? ` · ${ruleSet.description}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="size-4" />
          Current rule version
        </div>
      </div>

      {/* Rule Summary */}

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        <RuleCard
          icon={
            <Percent className="size-5" />
          }
          title="Attendance"
          value={
            rules.attendance?.required
              ? `${rules.attendance.minimumPercentage ?? 0}% minimum`
              : "Not required"
          }
          detail={
            rules.attendance?.required
              ? rules.attendance.scope ===
                "EVERY_COURSE"
                ? "Required for every course"
                : "Overall attendance"
              : undefined
          }
        />

        <RuleCard
          icon={
            <ShieldCheck className="size-5" />
          }
          title="Payment"
          value={
            rules.payment?.required
              ? `${rules.payment.minimumCompletionPercentage ?? 0}% completion`
              : "Not required"
          }
          detail="Fee completion requirement"
        />

        <RuleCard
          icon={
            <BookOpenCheck className="size-5" />
          }
          title="Theory Examination"
          value={
            rules.theory?.required
              ? "Required"
              : "Not required"
          }
          detail={
            rules.theory?.required
              ? rules.theory.mustPass
                ? "Student must pass"
                : "Passing not mandatory"
              : undefined
          }
        />

        <RuleCard
          icon={
            <FlaskConical className="size-5" />
          }
          title="Practical Examination"
          value={
            rules.practical?.required
              ? "Required"
              : "Not required"
          }
          detail={
            rules.practical?.required
              ? rules.practical.mustPass
                ? "Student must pass"
                : "Passing not mandatory"
              : undefined
          }
        />

        <RuleCard
  icon={
    <FileCheck2 className="size-5" />
  }
  title="Certificate"
  value={
    rules.certificate?.required
      ? "Required"
      : "Not required"
  }
  detail={
  rules.certificate?.required ? (
    <span className="inline-flex items-center gap-1">
      <IndianRupee className="size-3.5" />
      {rules.certificate.fee ?? 0}
    </span>
  ) : undefined
}
/>

        <RuleCard
          icon={
            <GraduationCap className="size-5" />
          }
          title="Eligibility"
          value="Based on all configured rules"
          detail="Evaluated before registration and graduation"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Rule Card                                                                  */
/* -------------------------------------------------------------------------- */

function RuleCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-5 transition hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <p className="font-medium">
          {title}
        </p>
      </div>

      <p className="mt-4 font-semibold">
        {value}
      </p>

      {detail && (
        <p className="mt-1 text-sm text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}