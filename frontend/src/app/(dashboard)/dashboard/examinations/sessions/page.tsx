import Link from "next/link";

import { examSessionService } from "@/modules/exams/sessions/exam-session.service";
import { ExamSessionTable } from "@/app/(dashboard)/dashboard/people/students/_components/exams/ExamSessionTable";

export default async function ExaminationSessionsPage() {
  /*
   * Temporary school ID.
   *
   * Replace this with the authenticated
   * school ID once the ERP auth/context is connected.
   */
  const schoolId = "1e8bc766-b453-4329-a7b3-b77fc625643a";

type ExamSessions = Awaited<
  ReturnType<typeof examSessionService.getAll>
>;

let sessions: ExamSessions = [];

try {
  sessions = await examSessionService.getAll(
    schoolId,
  );
} catch (error) {
  console.error(
    "Failed to load examination sessions:",
    error,
  );
}

const serializedSessions = sessions.map(
  (session) => ({
    id: session.id,

    name: session.name,

    code: session.code,

    academicYear:
      session.academicYear,

    status: session.status,

    startsAt:
      session.startsAt?.toISOString() ??
      null,

    endsAt:
      session.endsAt?.toISOString() ??
      null,
  }),
);

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-2xl font-bold">
      Examination Sessions
    </h1>

    <p className="mt-1 text-sm text-muted-foreground">
      Create and manage examination
      sessions for your school.
    </p>
  </div>

  <Link
    href="/dashboard/examinations/sessions/new"
    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
  >
    + New Examination Session
  </Link>
</div>

      {/* Session statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Sessions"
          value={serializedSessions.length}
        />

        <StatCard
          label="Draft"
          value={
            serializedSessions.filter(
              (session) =>
                session.status ===
                "DRAFT",
            ).length
          }
        />

        <StatCard
          label="Open"
          value={
            serializedSessions.filter(
              (session) =>
                session.status ===
                "OPEN",
            ).length
          }
        />

        <StatCard
          label="Completed"
          value={
            serializedSessions.filter(
              (session) =>
                session.status ===
                "COMPLETED",
            ).length
          }
        />
      </div>

      {/* Sessions */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            All Examination Sessions
          </h2>

          <p className="text-sm text-muted-foreground">
            Select a session to manage its
            examinations and registrations.
          </p>
        </div>

        <ExamSessionTable
          sessions={serializedSessions}
        />
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}