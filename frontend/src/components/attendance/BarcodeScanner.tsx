"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface BarcodeScannerProps {
  loading?: boolean;

  onScan: (
    registrationNumber: string,
  ) => void;
}

export function BarcodeScanner({
  loading = false,
  onScan,
}: BarcodeScannerProps) {
  const [value, setValue] = useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const registrationNumber =
      value.trim();

    if (!registrationNumber) {
      return;
    }

    onScan(registrationNumber);

    setValue("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          Campus Entry Scanner
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Scan the student&apos;s registration
          barcode when they enter the campus.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Registration Number
          </span>

          <input
            ref={inputRef}
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            autoComplete="off"
            autoFocus
            placeholder="Scan barcode..."
            className="w-full rounded-md border px-4 py-3 text-lg outline-none focus:ring-2"
          />
        </label>

        <button
          type="submit"
          disabled={
            loading ||
            !value.trim()
          }
          className="w-full rounded-md bg-black px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : "Scan Student"}
        </button>
      </form>

      <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-muted-foreground">
        <strong className="text-gray-900">
          Scanner tip:
        </strong>{" "}
        Most USB barcode scanners behave like
        a keyboard. Place the cursor in the
        registration field and scan the student&apos;s
        barcode.
      </div>
    </div>
  );
}