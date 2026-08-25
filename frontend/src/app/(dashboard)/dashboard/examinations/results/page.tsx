import Link from "next/link";

const examinationModules = [
  {
    title: "Examination Sessions",
    description:
      "Create and manage examination sessions, academic years, dates, and rule sets.",
    href: "/dashboard/examinations/sessions",
    label: "Manage Sessions",
  },
  {
    title: "Examinations",
    description:
      "Create theory and practical examinations, configure marks, dates, and venues.",
    href: "/dashboard/examinations/exams",
    label: "Manage Exams",
  },
  {
    title: "Eligibility",
    description:
      "Evaluate students against attendance and examination eligibility rules.",
    href: "/dashboard/examinations/eligibility",
    label: "Check Eligibility",
  },
  {
    title: "Registration",
    description:
      "Register eligible students for examinations.",
    href: "/dashboard/examinations/registration",
    label: "Manage Registration",
  },
  {
    title: "Results",
    description:
      "Enter marks, calculate grades, review results, and publish them.",
    href: "/dashboard/examinations/results",
    label: "Manage Results",
  },
  {
    title: "Graduation",
    description:
      "Determine whether students have successfully completed the examination requirements.",
    href: "/dashboard/examinations/graduation",
    label: "Evaluate Graduation",
  },
  {
    title: "Certificates",
    description:
      "Create, verify, issue, and manage student examination certificates.",
    href: "/dashboard/examinations/certificate",
    label: "Manage Certificates",
  },
];

export default function ExaminationsPage() {
  return (
    <main className="space-y-8 p-6">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Academic Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Examinations
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage examination sessions, examinations,
              eligibility, registration, results,
              graduation, and certificates from one place.
            </p>
          </div>

          <Link
            href="/dashboard/examinations/sessions"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Manage Sessions
          </Link>
        </div>
      </section>

      {/* Workflow */}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-5">
          <h2 className="font-semibold">
            Examination Workflow
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Follow the examination lifecycle from session
            creation to certificate issuance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <WorkflowStep number="1" label="Session" />
          <Arrow />
          <WorkflowStep number="2" label="Exam" />
          <Arrow />
          <WorkflowStep number="3" label="Eligibility" />
          <Arrow />
          <WorkflowStep number="4" label="Registration" />
          <Arrow />
          <WorkflowStep number="5" label="Results" />
          <Arrow />
          <WorkflowStep number="6" label="Graduation" />
          <Arrow />
          <WorkflowStep number="7" label="Certificate" />
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Examination Management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a module to continue.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {examinationModules.map((module) => (
            <ModuleCard
              key={module.href}
              title={module.title}
              description={module.description}
              href={module.href}
              label={module.label}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------- */
/* Module Card                                        */
/* -------------------------------------------------- */

function ModuleCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-full flex-col">
        <div>
          <h3 className="text-lg font-semibold group-hover:underline">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 flex items-center text-sm font-medium">
          <span>{label}</span>

          <span className="ml-2 transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------- */
/* Workflow                                           */
/* -------------------------------------------------- */

function WorkflowStep({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
        {number}
      </span>

      <span className="font-medium">
        {label}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <span className="hidden text-muted-foreground sm:inline">
      →
    </span>
  );
}