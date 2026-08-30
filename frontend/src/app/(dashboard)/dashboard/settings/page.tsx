import Link from "next/link";
import {
  Building2,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Award,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const settings = [
  {
    title: "Institution",
    description:
      "Manage school information and institutional details.",
    href: "/dashboard/settings/institution",
    icon: Building2,
  },
  {
    title: "Academic",
    description:
      "Configure academic structure and academic preferences.",
    href: "/dashboard/settings/academic",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    description:
      "Configure attendance requirements and attendance preferences.",
    href: "/dashboard/settings/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Payments",
    description:
      "Manage payment and fee-related configuration.",
    href: "/dashboard/settings/payments",
    icon: CreditCard,
  },
  {
    title: "Certificates",
    description:
      "Configure certificate generation and verification.",
    href: "/dashboard/settings/certificates",
    icon: Award,
  },
  {
    title: "Security",
    description:
      "Manage authentication and system security preferences.",
    href: "/dashboard/settings/security",
    icon: ShieldCheck,
  },
];

export default function SettingsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure your ERP system and institutional preferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="size-5" />
              </div>

              <h2 className="mt-4 font-semibold">
                {item.title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium">
                Configure
                <ChevronRight className="size-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}