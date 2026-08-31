"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateAdmissionAction } from "~/modules/admission/actions/update-admission";

interface AdmissionEditDialogProps {
  schoolId: string;
  admission: {
    id: string;
    courseId: string;
    batchId: string | null;
    session: string | null;
    isActive: boolean;
  };
}

interface Course {
  id: string;
  code: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  courseId: string;
}

export function AdmissionEditDialog({ schoolId, admission }: AdmissionEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courseId, setCourseId] = useState(admission.courseId);
  const [batchId, setBatchId] = useState(admission.batchId ?? "");
  const [session, setSession] = useState(admission.session ?? "");
  const [isActive, setIsActive] = useState(admission.isActive);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/courses").then(async (response) => {
      if (response.ok) setCourses((await response.json()).data ?? []);
    });
  }, [open]);

  useEffect(() => {
    if (!open || !courseId) return;
    void fetch(`/api/batches?courseId=${courseId}`).then(async (response) => {
      if (response.ok) setBatches((await response.json()).data ?? []);
    });
  }, [open, courseId]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const result = await updateAdmissionAction(schoolId, admission.id, {
      courseId,
      batchId: batchId || null,
      session: session || "",
      isActive,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Admission updated successfully.");
      setOpen(false);
      window.location.reload();
    } else {
      toast.error(result.message ?? "Unable to update admission.");
    }
  }

  if (!open) {
    return <button type="button" onClick={() => setOpen(true)} className="text-sm font-medium text-blue-700 hover:underline">Edit admission</button>;
  }

  return (
    <form onSubmit={save} className="mt-4 space-y-4 rounded-lg border bg-muted/20 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">Course
          <select className="w-full rounded-md border bg-background px-3 py-2" value={courseId} onChange={(event) => { setCourseId(event.target.value); setBatchId(""); }}>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">Batch
          <select className="w-full rounded-md border bg-background px-3 py-2" value={batchId} onChange={(event) => setBatchId(event.target.value)} disabled={!courseId}>
            <option value="">Not assigned</option>
            {batches.filter((batch) => batch.courseId === courseId).map((batch) => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">Session
          <input className="w-full rounded-md border bg-background px-3 py-2" value={session} onChange={(event) => setSession(event.target.value)} />
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm font-medium"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Active admission</label>
      </div>
      <div className="flex gap-2"><button disabled={saving} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">{saving ? "Saving..." : "Save admission"}</button><button type="button" onClick={() => setOpen(false)} className="rounded-md border px-3 py-2">Cancel</button></div>
    </form>
  );
}
