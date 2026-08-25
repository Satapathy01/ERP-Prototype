import { examSessionService } from "@/modules/exams/sessions/exam-session.service";
import { CourseService } from "@/modules/courses/actions/services/course.service";

import { NewExamClient } from "./NewExamClient";

interface NewExamPageProps {
  searchParams: Promise<{
    sessionId?: string;
  }>;
}

export default async function NewExamPage({
  searchParams,
}: NewExamPageProps) {
  const params =
    await searchParams;

  const sessionId =
    params.sessionId;

  if (!sessionId) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          Examination session is required.
        </div>
      </main>
    );
  }

  const session =
    await examSessionService.getById(
      sessionId,
    );

  if (!session) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          Examination session not found.
        </div>
      </main>
    );
  }

  const courseService =
    new CourseService();

  const courses =
    await courseService.getAll(
      session.schoolId,
    );

  const serializedCourses =
  courses
    .filter(
      (course) =>
        course.isActive,
    )
    .map((course) => ({
      id: course.id,
      name: course.name,
      code:
        course.code ?? undefined,
    }));
    
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          {session.name}
          {session.code
            ? ` • ${session.code}`
            : ""}
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          Create Examination
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a theory or practical examination
          to this examination session.
        </p>
      </div>

      <NewExamClient
        sessionId={session.id}
        courses={serializedCourses}
      />
    </main>
  );
}