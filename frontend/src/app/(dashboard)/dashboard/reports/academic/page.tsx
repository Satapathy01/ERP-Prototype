import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Award,
} from "lucide-react";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCurrentUser } from "@/modules/auth/current-user";
import { getAcademicReport } from "@/modules/reports/academic/academic-reports.service";

export default async function AcademicReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load reports</CardTitle>
            <CardDescription>
              Your authentication session could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const report = await getAcademicReport(user.schoolId);

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-orange-500">
          Reports
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Academic Reports
        </h1>

        <p className="mt-2 text-muted-foreground">
          View academic performance, attendance, examination,
          and student progress reports.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Students"
          value={report.students.toString()}
          description="Active enrolled students"
          icon={Users}
        />

        <SummaryCard
          title="Courses"
          value={report.courses.toString()}
          description="Active academic courses"
          icon={BookOpen}
        />

        <SummaryCard
          title="Attendance"
          value={`${report.attendance}%`}
          description="Recorded attendance"
          icon={ClipboardCheck}
        />

        <SummaryCard
          title="Pass Rate"
          value={`${report.passRate}%`}
          description="Published examination results"
          icon={TrendingUp}
        />
      </div>

      {/* Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportCard
          icon={GraduationCap}
          title="Student Performance"
          description="Analyze student academic performance and examination results."
        >
          <ReportRow
            title="Examination Performance"
            description="Marks, grades, and pass/fail statistics"
            href="/dashboard/examinations/results"
          />

          <ReportRow
            title="Course Performance"
            description="Performance across individual courses"
            href="/dashboard/course"
          />

          <ReportRow
            title="Student Progress"
            description="Academic progress and completion status"
            href="/dashboard/people/students"
          />
        </ReportCard>

        <ReportCard
          icon={ClipboardCheck}
          title="Attendance Reports"
          description="Review attendance patterns and eligibility."
        >
          <ReportRow
            title="Attendance Summary"
            description="Student attendance percentages"
            href="/dashboard/academics/attendance"
          />

          <ReportRow
            title="Low Attendance"
            description="Students below the configured requirement"
            href="/dashboard/academics/attendance"
          />

          <ReportRow
            title="Course Attendance"
            description="Attendance statistics by course"
            href="/dashboard/academics/attendance"
          />
        </ReportCard>

        <ReportCard
          icon={Award}
          title="Examination Reports"
          description="Examine examination outcomes and academic results."
        >
          <ReportRow
            title="Examination Results"
            description="Published examination results"
            href="/dashboard/examinations/results"
          />

          <ReportRow
            title="Pass / Fail Analysis"
            description="Overall examination outcome statistics"
            href="/dashboard/examinations/results"
          />

          <ReportRow
            title="Grade Distribution"
            description="Distribution of grades across examinations"
            href="/dashboard/examinations/results"
          />
        </ReportCard>

        <ReportCard
          icon={GraduationCap}
          title="Graduation Reports"
          description="Review students who have completed graduation requirements."
        >
          <ReportRow
            title="Graduation Eligibility"
            description="Students meeting all graduation requirements"
            href="/dashboard/examinations/eligibility"
          />

          <ReportRow
            title="Pending Requirements"
            description="Students with incomplete requirements"
            href="/dashboard/examinations/eligibility"
          />

          <ReportRow
            title="Graduated Students"
            description="Completed graduation records"
            href="/dashboard/examinations/certificate"
          />
        </ReportCard>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-muted p-3">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <CardTitle>{title}</CardTitle>

            <CardDescription className="mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {children}
      </CardContent>
    </Card>
  );
}

function ReportRow({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/50"
    >
      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <span className="text-sm font-medium">
        View →
      </span>
    </Link>
  );
}
