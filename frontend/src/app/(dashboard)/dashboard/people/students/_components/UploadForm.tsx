"use client";

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ImportSummary } from "./ImportSummary";

type ImportResult = {
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: {
    row: number;
    errors: string[];
  }[];
};

type UploadFormProps = {
  onSuccess?: () => void;
};

export function UploadForm({
  onSuccess,
}: UploadFormProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ImportResult | null>(null);

  async function handleImport() {
    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const schoolId =
        process.env.NEXT_PUBLIC_SCHOOL_ID;

      if (schoolId) {
        formData.append(
          "schoolId",
          schoolId,
        );
      }

      const response = await fetch(
        "/api/import/students",
        {
          method: "POST",
          body: formData,
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json.message ??
            "Failed to import students.",
        );
      }

      setResult(json.data);

      onSuccess?.();

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Student import failed:",
        error,
      );

      alert("Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        disabled={loading}
        onChange={(event) => {
          const selectedFile =
            event.target.files?.[0];

          if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
          }
        }}
      />

      {file && (
        <div className="flex items-center gap-2 rounded-md border p-3">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />

          <div className="flex-1">
            <p className="font-medium">
              {file.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      <Button
        type="button"
        disabled={!file || loading}
        onClick={handleImport}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          "Import Students"
        )}
      </Button>

      {result && (
        <ImportSummary result={result} />
      )}
    </div>
  );
}