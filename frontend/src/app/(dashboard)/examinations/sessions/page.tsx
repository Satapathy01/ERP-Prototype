import Link from "next/link";

export default function ExaminationSessionsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Examinations
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Examination Sessions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create and manage examination sessions and their
          associated examination rules.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">
              Examination Sessions
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Examination sessions will appear here.
            </p>
          </div>

          <Link
            href="/dashboard/examinations"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Examinations
          </Link>
        </div>
      </div>
    </main>
  );
}
