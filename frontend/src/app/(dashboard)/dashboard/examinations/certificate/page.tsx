import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CertificatePage() {
  const schoolId = process.env.SCHOOL_ID;

  if (!schoolId) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          School ID is not configured.
        </div>
      </main>
    );
  }

  let certificates = [];

  try {
    certificates =
      await prisma.certificate.findMany({
        where: {
          schoolId,
        },

        select: {
          id: true,
          certificateNumber: true,
          certificateType: true,
          status: true,
          certificateFee: true,
          issuedAt: true,

          student: {
            select: {
              id: true,
              name: true,
              registrationNumber: true,
            },
          },

          session: {
            select: {
              id: true,
              name: true,
              academicYear: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
  } catch (error) {
    console.error(
      "Failed to load certificates:",
      error,
    );

    return (
      <main className="space-y-6 p-6">
        <PageHeader />

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load certificates.
        </div>
      </main>
    );
  }

  const total = certificates.length;

  const created = certificates.filter(
    (certificate) =>
      certificate.status === "CREATED",
  ).length;

  const ready = certificates.filter(
    (certificate) =>
      certificate.status === "READY_FOR_COLLECTION",
  ).length;

  const issued = certificates.filter(
    (certificate) =>
      certificate.status === "ISSUED",
  ).length;

  const cancelled = certificates.filter(
    (certificate) =>
      certificate.status === "CANCELLED",
  ).length;

  return (
    <main className="space-y-8 p-6">
      <PageHeader />

      {/* ------------------------------------------------ */}
      {/* Summary                                           */}
      {/* ------------------------------------------------ */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Certificates"
          value={total}
          description="Certificate records"
        />

        <SummaryCard
          title="Created"
          value={created}
          description="Awaiting payment/processing"
        />

        <SummaryCard
          title="Ready for Collection"
          value={ready}
          description="Ready to be collected"
        />

        <SummaryCard
          title="Issued"
          value={issued}
          description="Certificates issued"
        />
      </section>

      {/* ------------------------------------------------ */}
      {/* Quick Actions                                     */}
      {/* ------------------------------------------------ */}

      <section className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Create Certificate"
          description="Generate a certificate for a student who has completed the examination requirements."
          href="/dashboard/examinations/certificate/new"
          label="Create Certificate"
        />

        <ActionCard
          title="Verify Certificate"
          description="Verify a certificate using its certificate number."
          href="/dashboard/examinations/certificate/verify"
          label="Verify Certificate"
        />

        <ActionCard
          title="Graduation"
          description="Check student graduation and certificate eligibility before issuing a certificate."
          href="/dashboard/examinations/graduation"
          label="Check Graduation"
        />
      </section>

      {/* ------------------------------------------------ */}
      {/* Certificate List                                  */}
      {/* ------------------------------------------------ */}

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Certificates
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage generated and issued examination
              certificates.
            </p>
          </div>

          <Link
            href="/dashboard/examinations/certificate/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Create Certificate
          </Link>
        </div>

        {certificates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">
                    Certificate
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Student
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Examination
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Type
                  </th>

                  <th className="px-5 py-3 text-right font-medium">
                    Fee
                  </th>

                  <th className="px-5 py-3 text-center font-medium">
                    Status
                  </th>

                  <th className="px-5 py-3 text-center font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {certificates.map(
                  (certificate) => (
                    <tr
                      key={certificate.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {
                            certificate.certificateNumber
                          }
                        </div>

                        {certificate.issuedAt && (
                          <div className="text-xs text-muted-foreground">
                            Issued{" "}
                            {formatDate(
                              certificate.issuedAt,
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {certificate.student.name}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {
                            certificate.student
                              .registrationNumber
                          }
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          {certificate.session.name}
                        </div>

                        {certificate.session
                          .academicYear && (
                          <div className="text-xs text-muted-foreground">
                            {
                              certificate.session
                                .academicYear
                            }
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {certificate.certificateType}
                      </td>

                      <td className="px-5 py-4 text-right">
                        ₹
                        {Number(
                          certificate.certificateFee,
                        ).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <CertificateStatusBadge
                          status={
                            certificate.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/dashboard/examinations/certificate/${certificate.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ */}
      {/* Cancelled Count                                  */}
      {/* ------------------------------------------------ */}

      {cancelled > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          {cancelled} certificate
          {cancelled === 1 ? "" : "s"} currently
          cancelled.
        </div>
      )}
    </main>
  );
}

/* ================================================== */
/* Page Header                                        */
/* ================================================== */

function PageHeader() {
  return (
    <header>
      <Link
        href="/dashboard/examinations"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Examinations
      </Link>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Certificates
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Generate, verify, and manage examination
        certificates.
      </p>
    </header>
  );
}

/* ================================================== */
/* Summary Card                                       */
/* ================================================== */

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ================================================== */
/* Action Card                                        */
/* ================================================== */

function ActionCard({
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
      className="group rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h2 className="font-semibold group-hover:underline">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 text-sm font-medium">
        {label} →
      </div>
    </Link>
  );
}

/* ================================================== */
/* Status Badge                                       */
/* ================================================== */

function CertificateStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    NOT_CREATED:
      "bg-gray-100 text-gray-700",

    CREATED:
      "bg-blue-100 text-blue-700",

    READY_FOR_COLLECTION:
      "bg-yellow-100 text-yellow-700",

    ISSUED:
      "bg-green-100 text-green-700",

    CANCELLED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

/* ================================================== */
/* Empty State                                        */
/* ================================================== */

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <h3 className="font-semibold">
        No certificates found
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Certificates will appear here after they are
        generated for eligible students.
      </p>

      <Link
        href="/dashboard/examinations/certificate/new"
        className="mt-5 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Create Certificate
      </Link>
    </div>
  );
}

/* ================================================== */
/* Date Formatting                                    */
/* ================================================== */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}