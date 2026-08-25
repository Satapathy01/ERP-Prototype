"use client";

import {
  Award,
  BookOpen,
  GraduationCap,
  ListChecks,
  Settings2,
} from "lucide-react";

interface ExamDashboardProps {
  sessionCount: number;
  examCount: number;
  eligibleCount: number;
  resultCount: number;
  certificateCount: number;

  onSessions?: () => void;
  onExams?: () => void;
  onEligibility?: () => void;
  onResults?: () => void;
  onCertificates?: () => void;
  onRules?: () => void;
}

export function ExamDashboard({
  sessionCount,
  examCount,
  eligibleCount,
  resultCount,
  certificateCount,
  onSessions,
  onExams,
  onEligibility,
  onResults,
  onCertificates,
  onRules,
}: ExamDashboardProps) {
  const cards = [
    {
      label: "Exam Sessions",
      value: sessionCount,
      icon: GraduationCap,
      onClick: onSessions,
    },

    {
      label: "Examinations",
      value: examCount,
      icon: BookOpen,
      onClick: onExams,
    },

    {
      label: "Eligible Students",
      value: eligibleCount,
      icon: ListChecks,
      onClick: onEligibility,
    },

    {
      label: "Results",
      value: resultCount,
      icon: GraduationCap,
      onClick: onResults,
    },

    {
      label: "Certificates",
      value: certificateCount,
      icon: Award,
      onClick: onCertificates,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Examination Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage examination sessions,
          eligibility, results and
          certificates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.label}
              type="button"
              onClick={card.onClick}
              className="rounded-xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground" />

                <span className="text-2xl font-bold">
                  {card.value}
                </span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {card.label}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onRules}
        className="flex w-full items-center gap-3 rounded-xl border bg-white p-5 text-left hover:bg-muted/30"
      >
        <Settings2 className="h-5 w-5" />

        <div>
          <p className="font-medium">
            Examination Rules
          </p>

          <p className="text-sm text-muted-foreground">
            Configure payment, attendance,
            theory, practical, certificate and
            grading rules.
          </p>
        </div>
      </button>
    </div>
  );
}