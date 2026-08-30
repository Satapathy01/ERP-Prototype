import { GraduationCap } from "lucide-react";

export default function AcademicSettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Academic Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure academic structure and preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
            <GraduationCap className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Academic Configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Configure how academic information is organized.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SelectField
            label="Academic Year"
            options={[
              "2025-2026",
              "2026-2027",
              "2027-2028",
            ]}
          />

          <SelectField
            label="Semester System"
            options={[
              "Semester",
              "Annual",
              "Trimester",
            ]}
          />

          <SelectField
            label="Grading System"
            options={[
              "Percentage",
              "CGPA",
              "Letter Grade",
            ]}
          />

          <SelectField
            label="Course Structure"
            options={[
              "Department Based",
              "Program Based",
            ]}
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

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <select className="h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none">
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}