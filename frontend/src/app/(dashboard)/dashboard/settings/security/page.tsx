import { ShieldCheck } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Security
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage authentication and system security preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Security Configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Configure basic system security behaviour.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <Toggle
            label="Require secure authentication"
            description="Require authenticated users to access ERP resources."
          />

          <Toggle
            label="Enable session protection"
            description="Protect authenticated sessions from unauthorized access."
          />

          <Toggle
            label="Enable audit logging"
            description="Record important administrative actions for auditing."
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
    <label className="flex items-start justify-between gap-4 rounded-lg border p-4">
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