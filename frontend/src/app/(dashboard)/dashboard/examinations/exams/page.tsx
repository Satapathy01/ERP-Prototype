import Link from "next/link";

import { examService } from "@/modules/exams/exams/exam.service";
import { examSessionService } from "@/modules/exams/sessions/exam-session.service";

interface ExamsPageProps {
  searchParams: Promise<{
    sessionId?: string;
  }>;
}

export default async function ExamsPage({
  searchParams,
}: ExamsPageProps) {
  const params = await searchParams;

  const sessionId = params.sessionId;

  /*
   * --------------------------------------------------
   * No session selected
   * --------------------------------------------------
   */

  if (!sessionId) {
    return (
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Examinations
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Select an examination session to view
            and manage its examinations.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No examination session selected.
          </p>

          <Link
            href="/dashboard/examinations/sessions"
            className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Select Examination Session
          </Link>
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * Load session
   * --------------------------------------------------
   */

  let session;

  try {
    session =
      await examSessionService.getById(
        sessionId,
      );
  } catch (error) {
    console.error(
      "Failed to load examination session:",
      error,
    );

    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Failed to load examination session.
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Examination session not found.
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * Load examinations
   * --------------------------------------------------
   */

  let exams;

  try {
    exams =
      await examService.getBySession(
        sessionId,
      );
  } catch (error) {
    console.error(
      "Failed to load examinations:",
      error,
    );

    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Failed to load examinations.
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * Page
   * --------------------------------------------------
   */

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/dashboard/examinations/sessions"
              className="hover:underline"
            >
              Examination Sessions
            </Link>

            <span>/</span>

            <span>{session.name}</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold">
            Examinations
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {session.name}
            {session.code
              ? ` • ${session.code}`
              : ""}
            {session.academicYear
              ? ` • ${session.academicYear}`
              : ""}
          </p>
        </div>

        <Link
          href={`/dashboard/examinations/exams/new?sessionId=${session.id}`}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          + New Exam
        </Link>
      </div>

      {/* Session information */}
      <section className="grid gap-4 md:grid-cols-4">
        <InfoCard
          label="Status"
          value={session.status}
        />

        <InfoCard
          label="Examinations"
          value={String(exams.length)}
        />

        <InfoCard
          label="Start"
          value={
            session.startsAt
              ? session.startsAt.toLocaleDateString(
                  "en-IN",
                )
              : "Not set"
          }
        />

        <InfoCard
          label="End"
          value={
            session.endsAt
              ? session.endsAt.toLocaleDateString(
                  "en-IN",
                )
              : "Not set"
          }
        />
      </section>

      {/* Examination table */}
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">
              Examination List
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Examinations configured for this
              session.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {exams.length}{" "}
            {exams.length === 1
              ? "Exam"
              : "Exams"}
          </span>
        </div>

        {exams.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="font-medium">
                No examinations yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Create the first examination for
                this session.
              </p>

              <Link
                href={`/dashboard/examinations/exams/new?sessionId=${session.id}`}
                className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
              >
                + Create Examination
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-5 py-3 font-medium">
                    Examination
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Course
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Type
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Marks
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Registrations
                  </th>
                </tr>
              </thead>

              <tbody>
                {exams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    {/* Exam */}
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {exam.name}
                      </div>

                      {exam.code && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {exam.code}
                        </div>
                      )}
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {exam.course.name}
                      </div>

                      {exam.course.code && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {exam.course.code}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          exam.type ===
                          "THEORY"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {exam.type ===
                        "THEORY"
                          ? "Theory"
                          : "Practical"}
                      </span>
                    </td>

                    {/* Marks */}
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {Number(
                          exam.passMarks,
                        )}{" "}
                        /{" "}
                        {Number(
                          exam.maxMarks,
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Pass / Maximum
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      {exam.examDate ? (
                        <div>
                          {exam.examDate.toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Not scheduled
                        </span>
                      )}
                    </td>

                    {/* Registrations */}
                    <td className="px-5 py-4">
                      <span className="font-medium">
                        {
                          exam._count
                            .registrations
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

/*
 * --------------------------------------------------
 * Small information card
 * --------------------------------------------------
 */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}