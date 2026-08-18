"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function FinanceError({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="space-y-5 text-center">
        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="max-w-md text-muted-foreground">
          We couldn&apos;t load the finance module.
          Please try again.
        </p>

        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}