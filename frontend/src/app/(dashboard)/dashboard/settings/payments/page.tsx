import { CreditCard } from "lucide-react";

export default function PaymentSettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Payment Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure payment and fee-related preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
            <CreditCard className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Payment Configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Configure default payment requirements.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium">
              Default Payment Completion
            </label>

            <div className="mt-2 flex max-w-sm items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                defaultValue="100"
                className="h-11 w-full rounded-lg border px-3 text-sm outline-none"
              />

              <span className="text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>

          <Toggle
            label="Require payment before examination"
            description="Students must satisfy the payment requirement before registration."
          />

          <Toggle
            label="Allow partial payments"
            description="Allow students to complete payments in multiple transactions."
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