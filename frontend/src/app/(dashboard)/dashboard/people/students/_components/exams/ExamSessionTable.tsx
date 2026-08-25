"use client";

interface ExamSession {
  id: string;
  name: string;
  code?: string | null;
  academicYear?: string | null;
  status: string;
  startsAt?: string | Date | null;
  endsAt?: string | Date | null;
}

interface ExamSessionTableProps {
  sessions: ExamSession[];
  loading?: boolean;
  onSelect?: (session: ExamSession) => void;
  onEdit?: (session: ExamSession) => void;
}

export function ExamSessionTable({
  sessions,
  loading = false,
  onSelect,
  onEdit,
}: ExamSessionTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Loading examination sessions...
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        No examination sessions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">
              Session
            </th>

            <th className="px-4 py-3 text-left">
              Academic Year
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Start
            </th>

            <th className="px-4 py-3 text-right">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {sessions.map((session) => (
            <tr
              key={session.id}
              className="hover:bg-muted/30"
            >
              <td
                className="cursor-pointer px-4 py-3"
                onClick={() =>
                  onSelect?.(session)
                }
              >
                <div className="font-medium">
                  {session.name}
                </div>

                {session.code && (
                  <div className="text-xs text-muted-foreground">
                    {session.code}
                  </div>
                )}
              </td>

              <td className="px-4 py-3">
                {session.academicYear ?? "—"}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full border px-2 py-1 text-xs">
                  {session.status}
                </span>
              </td>

              <td className="px-4 py-3">
                {session.startsAt
                  ? new Date(
                      session.startsAt,
                    ).toLocaleDateString()
                  : "—"}
              </td>

              <td className="px-4 py-3 text-right">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(session)
                    }
                    className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}