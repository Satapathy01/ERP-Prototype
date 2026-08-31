"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type CertificateStatus =
  | "NOT_CREATED"
  | "CREATED"
  | "READY_FOR_COLLECTION"
  | "ISSUED"
  | "CANCELLED";

export interface Certificate {
  id: string;

  schoolId: string;

  studentId: string;
  admissionId: string | null;

  sessionId: string;

  certificateNumber: string;

  certificateType: string;

  status: CertificateStatus;

  certificateFee: number | string;

  paymentId: string | null;

  createdAt: string;
  createdBy: string | null;

  readyAt: string | null;

  issuedAt: string | null;
  issuedBy: string | null;

  cancelledAt: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
}

interface UseCertificatesResult {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  createCertificate: (
    input: {
      studentId: string;
      admissionId?: string;
      sessionId: string;
      certificateNumber: string;
      certificateType?: string;
      certificateFee?: number;
      createdBy?: string;
    },
  ) => Promise<Certificate>;

  attachPayment: (
    certificateId: string,
    paymentId: string,
  ) => Promise<Certificate>;

  markReady: (
    certificateId: string,
  ) => Promise<Certificate>;

  issue: (
    certificateId: string,
    issuedBy?: string,
  ) => Promise<Certificate>;

  cancel: (
    certificateId: string,
    reason: string,
    cancelledBy?: string,
  ) => Promise<Certificate>;
}

export function useCertificates(
  studentId?: string,
  sessionId?: string,
): UseCertificatesResult {
  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!studentId && !sessionId) {
      setCertificates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (studentId) {
        params.set(
          "studentId",
          studentId,
        );
      } else if (sessionId) {
        params.set(
          "sessionId",
          sessionId,
        );
      }

      const response = await fetch(
        `/api/exams/certificates?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to load certificates.",
        );
      }

      setCertificates(
        data.certificates ?? [],
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load certificates.",
      );
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId]);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void refresh();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [refresh]);

  const createCertificate = useCallback(
    async (input: {
      studentId: string;
      admissionId?: string;
      sessionId: string;
      certificateNumber: string;
      certificateType?: string;
      certificateFee?: number;
      createdBy?: string;
    }) => {
      const response = await fetch(
        "/api/exams/certificates",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(input),
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to create certificate.",
        );
      }

      await refresh();

      return data.certificate as Certificate;
    },
    [refresh],
  );

  const attachPayment = useCallback(
    async (
      certificateId: string,
      paymentId: string,
    ) => {
      const response = await fetch(
        `/api/exams/certificates/${certificateId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            paymentId,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to attach payment.",
        );
      }

      await refresh();

      return data.certificate as Certificate;
    },
    [refresh],
  );

  const markReady = useCallback(
    async (certificateId: string) => {
      const response = await fetch(
        `/api/exams/certificates/${certificateId}/ready`,
        {
          method: "POST",
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to mark certificate ready.",
        );
      }

      await refresh();

      return data.certificate as Certificate;
    },
    [refresh],
  );

  const issue = useCallback(
    async (
      certificateId: string,
      issuedBy?: string,
    ) => {
      const response = await fetch(
        `/api/exams/certificates/${certificateId}/issue`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            issuedBy,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to issue certificate.",
        );
      }

      await refresh();

      return data.certificate as Certificate;
    },
    [refresh],
  );

  const cancel = useCallback(
    async (
      certificateId: string,
      reason: string,
      cancelledBy?: string,
    ) => {
      const response = await fetch(
        `/api/exams/certificates/${certificateId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reason,
            cancelledBy,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Failed to cancel certificate.",
        );
      }

      await refresh();

      return data.certificate as Certificate;
    },
    [refresh],
  );

  return {
    certificates,
    loading,
    error,
    refresh,
    createCertificate,
    attachPayment,
    markReady,
    issue,
    cancel,
  };
}