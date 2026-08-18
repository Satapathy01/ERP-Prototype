import CourseDialog from "@/components/course/CourseDialog";
import CourseTable from "@/components/course/CourseTable";
import { courseService } from "@/modules/courses/actions/services/course.service";

export default async function CoursePage() {
  // TODO: Replace with authenticated schoolId
  const schoolId = "e448f8be-1387-40ee-8eac-63892fe51611";

  const courses = await courseService.getAll(schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Course Master
          </h1>

          <p className="text-muted-foreground">
            Manage all available courses.
          </p>
        </div>

        <CourseDialog schoolId={schoolId} />
      </div>

      <CourseTable
        schoolId={schoolId}
        courses={courses}
      />
    </div>
  );
}