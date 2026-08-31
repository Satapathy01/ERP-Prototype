interface ExaminationSessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function ExaminationSessionPage({
  params,
}: ExaminationSessionPageProps) {
  const { sessionId } = await params;

  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Examinations
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Examination Session
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage examination session details, exams, registrations,
          and eligibility.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">
          Session ID
        </p>

        <p className="mt-1 font-mono font-medium">
          {sessionId}
        </p>
      </div>
    </main>
  );
}
