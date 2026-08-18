"use client";

import Image from "next/image";

interface ReceiptHeaderProps {
  thermal?: boolean;
}

export default function ReceiptHeader({
  thermal = false,
}: ReceiptHeaderProps) {
  return (
    <div
      className={`text-center ${
        thermal ? "space-y-1" : "space-y-2"
      }`}
    >
      {/* Logo */}

      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="Institute Logo"
          width={thermal ? 40 : 70}
          height={thermal ? 40 : 70}
          priority
        />
      </div>

      {/* Institute */}

      <div>
        <h1
          className={`font-bold ${
            thermal ? "text-sm" : "text-2xl"
          }`}
        >
          Collaborative Institute of Computer Application
        </h1>

        <p
          className={`text-muted-foreground ${
            thermal ? "text-[11px]" : "text-sm"
          }`}
        >
          Registered Under Ministry of Corporate Affairs
        </p>

        <p
          className={`${
            thermal ? "text-[10px]" : "text-sm"
          }`}
        >
          Puri, Odisha
        </p>

        <p
          className={`${
            thermal ? "text-[20px]" : "text-sm"
          }`}
        >
          +91 8339012220, +91 9124140235
        </p>
      </div>

      <hr className="border-dashed" />
    </div>
  );
}