import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function EligibilityPage() {
  /*
   * IMPORTANT:
   * Replace this with the same schoolId source used by
   * your examinations/sessions/page.tsx.
   *
   * Do NOT hard-code a school ID in production.
   */
  const schoolId = process.env.SCHOOL_ID;

  if (!schoolId) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          School ID is not configured.
        </div>
      </main>
    );
  }

  let sessions = [];

  try {
    sessions = await prisma.examSession.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        academicYear: true,
        status: true,

        _count: {
          select: {
            eligibilities: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(
      "Failed to load examination sessions:",
      error,
    );

    return (
      <main className="space-y-6 p-6">
        <PageHeader />

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load examination sessions.
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6">
      <PageHeader />

      {/* ------------------------------------------------ */}
      {/* Overview Cards                                   */}
      {/* ------------------------------------------------ */}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Examination Sessions"
          value={sessions.length}
          description="Available examination sessions"
        />

        <SummaryCard
          title="Evaluated Students"
          value={sessions.reduce(
            (total, session) =>
              total + session._count.eligibilities,
            0,
          )}
          description="Eligibility evaluations"
        />

        <SummaryCard
          title="Active Sessions"
          value={
            sessions.filter(
              (session) =>
                session.status === "OPEN" ||
                session.status === "IN_PROGRESS",
            ).length
          }
          description="Sessions accepting evaluation"
        />
      </section>

      {/* ------------------------------------------------ */}
      {/* Session List                                     */}
      {/* ------------------------------------------------ */}

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Examination Eligibility
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select an examination session to evaluate
              student eligibility.
            </p>
          </div>

          <Link
            href="/dashboard/examinations/sessions"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Manage Sessions
          </Link>
        </div>

        {sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y">
            {sessions.map((session) => {
              const canEvaluate =
                session.status === "OPEN" ||
                session.status === "IN_PROGRESS";

              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {session.name}
                      </h3>

                      <StatusBadge
                        status={session.status}
                      />
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {session.code && (
                        <span>
                          Code: {session.code}
                        </span>
                      )}

                      {session.academicYear && (
                        <span>
                          Academic Year:{" "}
                          {session.academicYear}
                        </span>
                      )}

                      <span>
                        Evaluations:{" "}
                        {session._count.eligibilities}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/dashboard/examinations/eligibility/${session.id}`}
                      className={
                        canEvaluate
                          ? "rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                          : "rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      }
                    >
                      {canEvaluate
                        ? "Evaluate Eligibility"
                        : "View Eligibility"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================================================== */
/* Page Header                                        */
/* ================================================== */

function PageHeader() {
  return (
    <header>
      <Link
        href="/dashboard/examinations"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Examinations
      </Link>

      <div className="mt-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Examination Eligibility
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Evaluate whether students are eligible to
          register for their examinations.
        </p>
      </div>
    </header>
  );
}

/* ================================================== */
/* Summary Card                                       */
/* ================================================== */

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ================================================== */
/* Status Badge                                       */
/* ================================================== */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    DRAFT:
      "bg-gray-100 text-gray-700",
    OPEN:
      "bg-blue-100 text-blue-700",
    IN_PROGRESS:
      "bg-yellow-100 text-yellow-700",
    COMPLETED:
      "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

/* ================================================== */
/* Empty State                                        */
/* ================================================== */

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <h3 className="font-semibold">
        No examination sessions found
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Create an examination session before evaluating
        student eligibility.
      </p>

      <Link
        href="/dashboard/examinations/sessions"
        className="mt-5 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Create Examination Session
      </Link>
    </div>
  );
}