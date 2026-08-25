import {
  Award,
  BookOpenCheck,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Settings2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    title: "Exam Sessions",
    description: "Create and manage examination sessions.",
    icon: BookOpenCheck,
  },
  {
    title: "Eligibility",
    description: "Check student eligibility for examinations.",
    icon: ClipboardCheck,
  },
  {
    title: "Results",
    description: "Manage theory and practical results.",
    icon: GraduationCap,
  },
  {
    title: "Certificates",
    description: "Generate and issue course certificates.",
    icon: Award,
  },
  {
    title: "Examination Rules",
    description: "Configure dynamic examination rules.",
    icon: Settings2,
  },
  {
    title: "Certificate Verification",
    description: "Verify certificates using certificate numbers.",
    icon: FileCheck2,
  },
];

export default function ExaminationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Examinations
        </h1>

        <p className="text-muted-foreground">
          Manage examination sessions, eligibility, results,
          graduation and certificates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Card
              key={module.title}
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border p-2">
                    <Icon className="h-5 w-5" />
                  </div>

                  <CardTitle className="text-lg">
                    {module.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}