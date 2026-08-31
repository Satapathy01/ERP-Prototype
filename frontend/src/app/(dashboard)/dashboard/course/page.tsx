import CourseDialog from "@/components/course/CourseDialog";
import CourseTable from "@/components/course/CourseTable";

import { courseService } from "@/modules/courses/actions/services/course.service";
import { getAuthenticationUser } from "~/modules/auth/auth.helper";

export default async function CoursePage() {
  const user = await getAuthenticationUser();

  if (!user) {
    return (
      <div className="p-6">
        Unauthorized
      </div>
    );
  }

  const schoolId = user.schoolId;

  const courses = await courseService.getAll(
    schoolId
  );

  const safeCourses = courses.map((course) => ({
    ...course,
    admissionFee: Number(course.admissionFee),
    monthlyFee: Number(course.monthlyFee),
    certificateFee: Number(course.certificateFee),
    totalFee: Number(course.totalFee),
  }));

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

        <CourseDialog
          schoolId={schoolId}
        />
      </div>

      <CourseTable
        schoolId={schoolId}
        courses={safeCourses}
      />
    </div>
  );
}