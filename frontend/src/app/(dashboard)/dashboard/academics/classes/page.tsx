import Link from "next/link";

import CourseDialog from "@/components/course/CourseDialog";
import { BatchDialog } from "@/components/batch/BatchDialog";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { getBatches } from "~/modules/batch/batch.service";
import { courseService } from "~/modules/courses/actions/services/course.service";

export default async function ClassesPage() {
  const user = await getAuthenticationUser();

  if (!user) {
    return (
      <main className="p-6">
        Please sign in to manage classes.
      </main>
    );
  }

  const courses = await courseService.getAll(
    user.schoolId,
  );

  /*
   * IMPORTANT:
   * Prisma returns Decimal objects for fee fields.
   * Convert them to plain numbers before passing
   * course data into Client Components.
   */
  const safeCourses = courses.map((course) => ({
    ...course,
    admissionFee: Number(course.admissionFee),
    monthlyFee: Number(course.monthlyFee),
    certificateFee: Number(course.certificateFee),
    totalFee: Number(course.totalFee),
  }));

  const batchResult = await getBatches({
    schoolId: user.schoolId,
    page: 1,
    pageSize: 500,
    isActive: true,
  });

  const batchesByCourse = new Map<
    string,
    typeof batchResult.batches
  >();

  for (const batch of batchResult.batches) {
    const current =
      batchesByCourse.get(batch.courseId) ?? [];

    current.push(batch);

    batchesByCourse.set(
      batch.courseId,
      current,
    );
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Academic Administration
          </p>

          <h1 className="text-2xl font-bold">
            Classes / Courses
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage course durations, batches, students,
            and section attendance.
          </p>
        </div>

        <CourseDialog
          schoolId={user.schoolId}
        />
      </header>

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Class
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Theory
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Practical
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Batches
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Students
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Attendance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {safeCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No classes found.
                  </td>
                </tr>
              ) : (
                safeCourses.map((course) => {
                  const batches =
                    batchesByCourse.get(course.id) ?? [];

                  const students =
                    batches.reduce(
                      (total, batch) =>
                        total + batch.currentStrength,
                      0,
                    );

                  return (
                    <tr
                      key={course.id}
                      className="align-top hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {course.name}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {course.code}
                        </div>

                        <CourseDialog
                          schoolId={user.schoolId}
                          course={course}
                          trigger={
                            <button
                              type="button"
                              className="mt-2 text-xs text-blue-700 hover:underline"
                            >
                              Edit class
                            </button>
                          }
                        />
                      </td>

                      <td className="px-4 py-4">
                        {course.theoryDurationDays} days
                      </td>

                      <td className="px-4 py-4">
                        {course.practicalDurationDays} days
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <span>{batches.length}</span>

                          <BatchDialog
                            courseId={course.id}
                          />

                          {batches.map((batch) => (
                            <div
                              key={batch.id}
                              className="min-w-52 rounded-md border p-2"
                            >
                              <div className="font-medium">
                                {batch.name}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {batch.currentStrength}{" "}
                                students · {batch.status}
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <BatchDialog
                                  courseId={course.id}
                                  batch={{
                                    id: batch.id,
                                    name: batch.name,
                                    teacherId:
                                      batch.teacherId,
                                    shift: batch.shift,
                                    startTime:
                                      batch.startTime,
                                    endTime:
                                      batch.endTime,
                                    capacity:
                                      batch.capacity,
                                  }}
                                />

                                <Link
                                  className="text-blue-700 hover:underline"
                                  href={`/dashboard/academics/class?courseId=${course.id}&batchId=${batch.id}&sectionType=THEORY`}
                                >
                                  Theory
                                </Link>

                                <Link
                                  className="text-blue-700 hover:underline"
                                  href={`/dashboard/academics/class?courseId=${course.id}&batchId=${batch.id}&sectionType=PRACTICAL`}
                                >
                                  Practical
                                </Link>

                                <Link
                                  className="text-blue-700 hover:underline"
                                  href={`/dashboard/academics/history?courseId=${course.id}&batchId=${batch.id}`}
                                >
                                  History
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {students}
                      </td>

                      <td className="px-4 py-4">
                        {course.isActive
                          ? "Active"
                          : "Inactive"}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          className="text-blue-700 hover:underline"
                          href={`/dashboard/academics/class?courseId=${course.id}`}
                        >
                          Open attendance
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}