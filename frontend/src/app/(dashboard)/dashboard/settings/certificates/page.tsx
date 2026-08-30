import { Award } from "lucide-react";

export default function CertificateSettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Certificate Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure examination certificate preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
            <Award className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Certificate Configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Configure certificate generation and verification.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Certificate Fee
            </label>

            <input
              type="number"
              min="0"
              defaultValue="500"
              className="mt-2 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Certificate Prefix
            </label>

            <input
              type="text"
              defaultValue="CERT"
              className="mt-2 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <Toggle
            label="Require graduation eligibility"
            description="Certificates can only be generated after graduation requirements are satisfied."
          />

          <Toggle
            label="Enable certificate verification"
            description="Allow certificates to be verified using their certificate number."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}

function Toggle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <label className="mb-3 flex items-start justify-between gap-4 rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        className="mt-1 size-4"
      />
    </label>
  );
}