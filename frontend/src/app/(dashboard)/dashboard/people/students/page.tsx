import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import { getStudents } from "~/modules/student";

import { StudentTable } from "./_components/Student/StudentTable";
import { StudentToolbar } from "./_components/Student/StudentToolbar";

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const { search = "", page = "1" } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);

  const user = await getAuthenticationUser();

  if (!user) {
    return (
      <div className="p-6">
        <p>Unauthorized</p>
      </div>
    );
  }

  const result = await getStudents({
    schoolId: user.schoolId,
    page: currentPage,
    search,
  });

  return (
    <div className="space-y-6 p-6">
      <StudentToolbar currentSearch={search} />

      <StudentTable
        students={result.students}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
      />
    </div>
  );
}