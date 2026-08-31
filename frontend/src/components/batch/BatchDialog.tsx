"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  name: string;
  role?: "ADMIN" | "STAFF" | null;
}

interface BatchDialogProps {
  courseId: string;
  batch?: {
    id: string;
    name: string;
    teacherId: string | null;
    shift: "MORNING" | "AFTERNOON" | "EVENING";
    startTime: string | null;
    endTime: string | null;
    capacity: number;
  };
}

export function BatchDialog({ courseId, batch }: BatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    void fetch("/api/teachers")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message ?? "Unable to load teachers.");
        }
        setTeachers(result.data ?? []);
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Unable to load teachers.");
      })
      .finally(() => setTeachersLoading(false));
  }, [open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/batches", {
      method: batch ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        id: batch?.id,
        teacherId: form.get("teacherId") || null,
        name: form.get("name"),
        shift: form.get("shift"),
        startTime: form.get("startTime"),
        endTime: form.get("endTime"),
        capacity: Number(form.get("capacity")),
        status: "ACTIVE",
      }),
    });
    const result = await response.json();
    setBusy(false);
    if (response.ok) {
      setOpen(false);
      window.location.reload();
    } else {
      setMessage(result.message ?? "Unable to create batch.");
    }
  }

  if (!open) return <button type="button" className="text-xs text-blue-700 hover:underline" onClick={() => { setTeachersLoading(true); setOpen(true); }}>{batch ? "Edit batch" : "Add batch"}</button>;

  return (
    <form onSubmit={submit} className="mt-2 space-y-2 rounded-md border bg-gray-50 p-3 text-sm">
      <input type="hidden" name="courseId" value={courseId} />
      <input required name="name" defaultValue={batch?.name ?? ""} placeholder="Batch name" className="w-full rounded-md border px-2 py-1.5" />
      <label className="block space-y-1">
        <span>Teacher</span>
        <select name="teacherId" defaultValue={batch?.teacherId ?? ""} disabled={teachersLoading} className="w-full rounded-md border px-2 py-1.5">
          <option value="">{teachersLoading ? "Loading teachers..." : teachers.length === 0 ? "No teachers registered. Please register a teacher first." : "No teacher selected"}</option>
          {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}{teacher.role ? ` - ${teacher.role}` : " - Teacher"}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <select name="shift" defaultValue={batch?.shift ?? "MORNING"} className="rounded-md border px-2 py-1.5"><option>MORNING</option><option>AFTERNOON</option><option>EVENING</option></select>
        <input required type="number" name="capacity" defaultValue={batch?.capacity ?? 30} min="1" max="500" className="rounded-md border px-2 py-1.5" />
        <input required type="time" name="startTime" defaultValue={batch?.startTime ?? ""} className="rounded-md border px-2 py-1.5" />
        <input required type="time" name="endTime" defaultValue={batch?.endTime ?? ""} className="rounded-md border px-2 py-1.5" />
      </div>
      {message && <p className="text-xs text-red-600">{message}</p>}
      <div className="flex gap-2"><button disabled={busy} className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">{busy ? "Saving..." : batch ? "Save changes" : "Save batch"}</button><button type="button" onClick={() => setOpen(false)} className="rounded-md border px-3 py-1.5">Cancel</button></div>
    </form>
  );
}
