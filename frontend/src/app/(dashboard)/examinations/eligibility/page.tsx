export default function ExaminationEligibilityPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Examinations
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Examination Eligibility
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review student eligibility for examinations based on
          the configured examination rules.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <p className="font-medium">
          Eligibility Management
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Student eligibility results will appear here.
        </p>
      </div>
    </main>
  );
}
