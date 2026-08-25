"use client";

interface ExamResultRow {
  id: string;
  examName?: string;
  courseName?: string;
  marksObtained?: number | null;
  percentage?: number | null;
  grade?: string | null;
  gradePoint?: number | null;
  status: string;
  publishedAt?: string | Date | null;
}

export function ResultTable({
  results,
}: {
  results: ExamResultRow[];
}) {
  if (!results.length) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        No examination results found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">
              Examination
            </th>

            <th className="px-4 py-3 text-left">
              Marks
            </th>

            <th className="px-4 py-3 text-left">
              Percentage
            </th>

            <th className="px-4 py-3 text-left">
              Grade
            </th>

            <th className="px-4 py-3 text-left">
              Grade Point
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {results.map((result) => (
            <tr key={result.id}>
              <td className="px-4 py-3">
                <div className="font-medium">
                  {result.examName ?? "Exam"}
                </div>

                {result.courseName && (
                  <div className="text-xs text-muted-foreground">
                    {result.courseName}
                  </div>
                )}
              </td>

              <td className="px-4 py-3">
                {result.marksObtained ?? "—"}
              </td>

              <td className="px-4 py-3">
                {result.percentage != null
                  ? `${result.percentage}%`
                  : "—"}
              </td>

              <td className="px-4 py-3 font-semibold">
                {result.grade ?? "—"}
              </td>

              <td className="px-4 py-3">
                {result.gradePoint ?? "—"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2 py-1 text-xs ${
                    result.status === "PASS"
                      ? "bg-green-50 text-green-700"
                      : result.status === "FAIL"
                        ? "bg-red-50 text-red-700"
                        : ""
                  }`}
                >
                  {result.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}