"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Session {
  id: string;
  name: string;
  code?: string | null;
  academicYear?: string | null;
  status?: string;
}

interface Student {
  id: string;
  name: string;
  registrationNumber?: string | null;
}

interface GraduationResult {
  eligible?: boolean;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export default function GraduationPage() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [sessionId, setSessionId] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [result, setResult] =
    useState<GraduationResult | null>(null);

  const [loadingSessions, setLoadingSessions] =
    useState(true);

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [evaluating, setEvaluating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  async function loadSessions() {
    try {
      setLoadingSessions(true);

      const response = await fetch(
        "/api/exams/sessions",
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to load examination sessions.",
        );
      }

      setSessions(data.sessions ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load examination sessions.",
      );
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadStudents() {
    try {
      setLoadingStudents(true);

      const response = await fetch(
        "/api/students",
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to load students.",
        );
      }
    
      /*
       * Support both:
       *
       * { students: [...] }
       *
       * and
       *
       * { data: { students: [...] } }
       */
      const list =
        data.students ??
        data.data?.students ??
        data.data ??
        [];

      setStudents(list);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load students.",
      );
    } finally {
      setLoadingStudents(false);
    }
  }
    useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadSessions();
    void loadStudents();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, []);

  async function evaluateGraduation() {
    if (!sessionId || !studentId) {
      setError(
        "Please select an examination session and student.",
      );
      return;
    }

    try {
      setEvaluating(true);
      setError(null);
      setResult(null);

      const response = await fetch(
        `/api/exams/graduation?studentId=${encodeURIComponent(
          studentId,
        )}&sessionId=${encodeURIComponent(
          sessionId,
        )}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to evaluate graduation eligibility.",
        );
      }

      setResult(
        data.graduation ?? null,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to evaluate graduation.",
      );
    } finally {
      setEvaluating(false);
    }
  }

  const selectedStudent =
    students.find(
      (student) =>
        student.id === studentId,
    );

  const selectedSession =
    sessions.find(
      (session) =>
        session.id === sessionId,
    );

  const isEligible =
    result?.eligible === true ||
    result?.status === "ELIGIBLE" ||
    result?.status === "PASSED";

  return (
    <main className="space-y-8 p-6">
      {/* Header */}

      <header>
        <Link
          href="/dashboard/examinations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Examinations
        </Link>

        <p className="mt-6 text-sm text-orange-500">
          Academic Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Graduation
        </h1>

        <p className="mt-2 text-muted-foreground">
          Check whether a student has completed all
          required examination requirements.
        </p>
      </header>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Evaluation Card */}

      <section className="rounded-2xl border bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <GraduationCap className="size-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Evaluate Graduation
            </h2>

            <p className="text-sm text-muted-foreground">
              Select a student and examination session.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Session */}

          <div>
            <label className="text-sm font-medium">
              Examination Session
            </label>

            <select
              value={sessionId}
              onChange={(event) => {
                setSessionId(event.target.value);
                setResult(null);
              }}
              disabled={loadingSessions}
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                {loadingSessions
                  ? "Loading sessions..."
                  : "Select examination session"}
              </option>

              {sessions.map((session) => (
                <option
                  key={session.id}
                  value={session.id}
                >
                  {session.name}
                  {session.academicYear
                    ? ` — ${session.academicYear}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Student */}

          <div>
            <label className="text-sm font-medium">
              Student
            </label>

            <select
              value={studentId}
              onChange={(event) => {
                setStudentId(event.target.value);
                setResult(null);
              }}
              disabled={loadingStudents}
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                {loadingStudents
                  ? "Loading students..."
                  : "Select student"}
              </option>

              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.name}
                  {student.registrationNumber
                    ? ` — ${student.registrationNumber}`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() =>
              void evaluateGraduation()
            }
            disabled={
              evaluating ||
              !sessionId ||
              !studentId
            }
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {evaluating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <GraduationCap className="size-4" />
                Evaluate Graduation
              </>
            )}
          </button>
        </div>
      </section>

      {/* Selection Summary */}

      {(selectedStudent ||
        selectedSession) && (
        <section className="rounded-xl border bg-gray-50 p-5">
          <p className="text-sm font-medium">
            Evaluation
          </p>

          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <span className="text-muted-foreground">
                Student
              </span>

              <p className="font-medium">
                {selectedStudent?.name ?? "-"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Examination Session
              </span>

              <p className="font-medium">
                {selectedSession?.name ?? "-"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Result */}

      {result && (
        <section
          className={`rounded-2xl border p-6 ${
            isEligible
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                isEligible
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isEligible ? (
                <CheckCircle2 className="size-6" />
              ) : (
                <XCircle className="size-6" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">
                {isEligible
                  ? "Student is Eligible for Graduation"
                  : "Student is Not Eligible for Graduation"}
              </h2>

              <p className="mt-2 text-sm">
                {result.message ??
                  (isEligible
                    ? "All configured graduation requirements have been satisfied."
                    : "One or more graduation requirements have not been satisfied.")}
              </p>

              <div className="mt-5 rounded-xl border bg-white/70 p-4">
                <p className="text-sm font-medium">
                  Evaluation Details
                </p>

                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs">
                  {JSON.stringify(
                    result,
                    null,
                    2,
                  )}
                </pre>
              </div>

              {isEligible && (
                <div className="mt-5">
                  <Link
                    href="/dashboard/examinations/certificate"
                    className="inline-flex rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Continue to Certificates →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}