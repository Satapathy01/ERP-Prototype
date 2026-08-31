"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Registration {
  id: string;
  status?: string;
  student?: {
    id: string;
    name?: string;
    registrationNumber?: string;
  };
  exam?: {
    id: string;
    name?: string;
    code?: string;
  };
}

interface Session {
  id: string;
  name: string;
  code?: string | null;
  academicYear?: string | null;
  status?: string;
}

async function readApiResponse(
  response: Response,
) {
  const contentType =
    response.headers.get("content-type") ?? "";

  const text = await response.text();

  if (!text) {
    throw new Error(
      `Server returned an empty response (${response.status}).`,
    );
  }

  if (!contentType.includes("application/json")) {
    console.error(
      "Expected JSON but received:",
      text.slice(0, 500),
    );

    throw new Error(
      `Server returned a non-JSON response (${response.status}).`,
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error(
      "Invalid JSON response:",
      text.slice(0, 500),
    );

    throw new Error(
      "Server returned invalid JSON.",
    );
  }
}

export default function RegistrationPage() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [sessionId, setSessionId] =
    useState("");

  const [registrations, setRegistrations] =
    useState<Registration[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingRegistrations, setLoadingRegistrations] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);



  async function loadSessions() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
  "/api/exams/sessions",
  {
    method: "GET",
    cache: "no-store",
  },
);

const data =
  await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to load examination sessions.",
        );
      }

      setSessions(
        data.sessions ?? [],
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load sessions.",
      );
    } finally {
      setLoading(false);
    }
  }
    useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadSessions();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, []);

  async function loadRegistrations(
    selectedSessionId: string,
  ) {
    setSessionId(selectedSessionId);

    if (!selectedSessionId) {
      setRegistrations([]);
      return;
    }

    try {
      setLoadingRegistrations(true);
      setError(null);

      const response = await fetch(
        `/api/exams/registrations?sessionId=${encodeURIComponent(
          selectedSessionId,
        )}`,
      );

      const data =
        await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to load registrations.",
        );
      }

      setRegistrations(
        data.registrations ?? [],
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load registrations.",
      );

      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  }

  return (
    <main className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/examinations"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Examinations
          </Link>

          <p className="mt-4 text-sm text-muted-foreground">
            Academic Administration
          </p>

          <h1 className="text-2xl font-bold">
            Examination Registration
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Register eligible students for
            examinations.
          </p>
        </div>

        <Link
          href="/dashboard/examinations/eligibility"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Check Eligibility
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Session selector */}

      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">
          Select Examination Session
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose the examination session whose
          registrations you want to manage.
        </p>

        <div className="mt-5">
          {loading ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Loading examination sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                No examination sessions found.
              </p>

              <Link
                href="/dashboard/examinations/sessions/new"
                className="mt-3 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Create Session
              </Link>
            </div>
          ) : (
            <select
              value={sessionId}
              onChange={(event) =>
                loadRegistrations(
                  event.target.value,
                )
              }
              className="w-full rounded-md border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black sm:max-w-xl"
            >
              <option value="">
                Select examination session
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
          )}
        </div>
      </section>

      {/* Registrations */}

      {sessionId && (
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">
              Registered Students
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Students registered for the selected
              examination session.
            </p>
          </div>

          {loadingRegistrations ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading registrations...
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium">
                No registrations found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Eligible students can be registered
                for examinations here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">
                      Student
                    </th>

                    <th className="px-5 py-3 text-left font-medium">
                      Registration Number
                    </th>

                    <th className="px-5 py-3 text-left font-medium">
                      Examination
                    </th>

                    <th className="px-5 py-3 text-left font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {registrations.map(
                    (registration) => (
                      <tr
                        key={registration.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium">
                          {registration.student
                            ?.name ??
                            "Unknown Student"}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {registration.student
                            ?.registrationNumber ??
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          {registration.exam
                            ?.name ??
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                            {registration.status ??
                              "REGISTERED"}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}