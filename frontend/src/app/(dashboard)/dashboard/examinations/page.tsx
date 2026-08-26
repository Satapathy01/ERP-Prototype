import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  IdCard,
  ListChecks,
  PenLine,
  ScrollText,
  Users,
} from "lucide-react";

export default function ExaminationsPage() {
  return (
    <main className="space-y-8 p-6">
      {/* ================================================== */}
      {/* Header                                             */}
      {/* ================================================== */}

      <header>
        <p className="text-sm font-medium text-muted-foreground">
          Academic Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Examinations
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage examination sessions, examinations,
          student eligibility, registrations, results,
          graduation, and certificates.
        </p>
      </header>

      {/* ================================================== */}
      {/* Quick Overview                                     */}
      {/* ================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          icon={CalendarDays}
          title="Sessions"
          description="Create and manage examination sessions."
          href="/dashboard/examinations/sessions"
        />

        <OverviewCard
          icon={PenLine}
          title="Examinations"
          description="Schedule theory and practical examinations."
          href="/dashboard/examinations/exams"
        />

        <OverviewCard
          icon={ClipboardCheck}
          title="Eligibility"
          description="Evaluate students before registration."
          href="/dashboard/examinations/eligibility"
        />

        <OverviewCard
          icon={ScrollText}
          title="Results"
          description="Enter, review, and publish results."
          href="/dashboard/examinations/results"
        />
      </section>

      {/* ================================================== */}
      {/* Examination Workflow                               */}
      {/* ================================================== */}

      <section className="rounded-xl border bg-white">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Examination Workflow
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Follow the examination lifecycle from session
            creation to certificate issuance.
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-5">
          <WorkflowStep
            number="01"
            icon={CalendarDays}
            title="Session"
            description="Create the examination session and select its rule set."
            href="/dashboard/examinations/sessions"
          />

          <WorkflowStep
            number="02"
            icon={PenLine}
            title="Exams"
            description="Create theory and practical examinations."
            href="/dashboard/examinations/exams"
          />

          <WorkflowStep
            number="03"
            icon={ClipboardCheck}
            title="Eligibility"
            description="Evaluate student eligibility."
            href="/dashboard/examinations/eligibility"
          />

          <WorkflowStep
            number="04"
            icon={ScrollText}
            title="Results"
            description="Enter marks and publish results."
            href="/dashboard/examinations/results"
          />

          <WorkflowStep
            number="05"
            icon={GraduationCap}
            title="Graduation"
            description="Determine successful completion."
            href="/dashboard/examinations/graduation"
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* Management                                         */}
      {/* ================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Examination Management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Administrative tools for examination operations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ManagementCard
            icon={CalendarDays}
            title="Examination Sessions"
            description="Manage academic examination sessions, dates, status, and rule sets."
            href="/dashboard/examinations/sessions"
          />

          <ManagementCard
            icon={PenLine}
            title="Examinations"
            description="Create examinations for courses and configure marks, dates, venues, and instructions."
            href="/dashboard/examinations/exams"
          />

          <ManagementCard
            icon={ClipboardCheck}
            title="Student Eligibility"
            description="Evaluate attendance and other configured requirements before registration."
            href="/dashboard/examinations/eligibility"
          />

          <ManagementCard
            icon={Users}
            title="Registration"
            description="Register eligible students for examinations."
            href="/dashboard/examinations/registration"
          />

          <ManagementCard
            icon={ScrollText}
            title="Results"
            description="Enter marks, calculate grades, review results, and publish them."
            href="/dashboard/examinations/results"
          />

          <ManagementCard
            icon={GraduationCap}
            title="Graduation"
            description="Check whether students have completed all required examinations."
            href="/dashboard/examinations/graduation"
          />

          <ManagementCard
            icon={FileCheck2}
            title="Certificates"
            description="Create, manage, issue, and verify examination certificates."
            href="/dashboard/examinations/certificate"
          />

          <ManagementCard
            icon={IdCard}
            title="Certificate Verification"
            description="Verify a certificate using its certificate number."
            href="/dashboard/examinations/certificate/verify"
          />

          <ManagementCard
            icon={ListChecks}
            title="Examination Rules"
            description="Configure grading, eligibility, theory, practical, and certificate rules."
            href="/dashboard/admin/rules"
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* Rule / Certificate Notice                         */}
      {/* ================================================== */}

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/admin/rules"
          className="rounded-xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <ListChecks className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Examination Rules
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Examination sessions use versioned rule sets
                so historical examinations retain the rules
                under which they were evaluated.
              </p>

              <span className="mt-4 inline-block text-sm font-medium">
                Manage rules →
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/examinations/certificate"
          className="rounded-xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Certificate Management
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Generate certificates only after the
                graduation requirements have been satisfied.
              </p>

              <span className="mt-4 inline-block text-sm font-medium">
                Manage certificates →
              </span>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

/* ================================================== */
/* Overview Card                                      */
/* ================================================== */

function OverviewCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5">
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="font-semibold group-hover:underline">
          {title}
        </h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-4 text-sm font-medium">
        Open →
      </div>
    </Link>
  );
}

/* ================================================== */
/* Workflow Step                                      */
/* ================================================== */

function WorkflowStep({
  number,
  icon: Icon,
  title,
  description,
  href,
}: {
  number: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative border-b p-5 transition hover:bg-gray-50 md:border-b-0 md:border-r md:last:border-r-0"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {number}
        </span>

        <Icon className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground" />
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

/* ================================================== */
/* Management Card                                    */
/* ================================================== */

function ManagementCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-lg bg-gray-100 p-3">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold group-hover:underline">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <span className="mt-4 inline-block text-sm font-medium">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}
