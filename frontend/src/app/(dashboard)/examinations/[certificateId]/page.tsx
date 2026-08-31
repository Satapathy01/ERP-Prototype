interface CertificatePageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

export default async function CertificatePage({
  params,
}: CertificatePageProps) {
  const { certificateId } = await params;

  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Examinations
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Certificate
        </h1>

        <p className="mt-2 text-muted-foreground">
          Certificate details and verification information.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">
          Certificate ID
        </p>

        <p className="mt-1 font-mono font-medium">
          {certificateId}
        </p>
      </div>
    </main>
  );
}
