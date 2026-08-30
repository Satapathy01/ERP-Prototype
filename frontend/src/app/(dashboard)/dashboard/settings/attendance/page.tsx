import { ClipboardCheck } from "lucide-react";

export default function AttendanceSettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Attendance Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure attendance requirements and behaviour.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
            <ClipboardCheck className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Attendance Configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Configure default attendance behaviour.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium">
              Minimum Attendance Percentage
            </label>

            <input
              type="number"
              min="0"
              max="100"
              defaultValue="75"
              className="mt-2 h-11 w-full rounded-lg border px-3 text-sm outline-none md:max-w-sm"
            />
          </div>

          <Toggle
            label="Require attendance for examination eligibility"
            description="Students must satisfy the configured attendance requirement."
          />

          <Toggle
            label="Enable campus scan attendance"
            description="Allow attendance to be recorded using registration scanning."
          />

          <Toggle
            label="Enable class attendance"
            description="Allow faculty to verify attendance during class."
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