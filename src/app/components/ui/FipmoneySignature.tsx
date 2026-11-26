"use client";

import React from "react";

interface FipmoneySignatureProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function FipmoneySignature({
  variant = "light",
  className = "",
}: FipmoneySignatureProps) {
  return (
    <div
      className={`w-full py-8 sm:py-10 flex items-center justify-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
        .fipmoney-signature-wordmark {
          font-family: 'Satisfy', cursive;
        }
      `}</style>
      <span
        className={`fipmoney-signature-wordmark text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-none ${
          variant === "dark"
            ? "text-emerald-200/35"
            : "text-[#047857]/25"
        }`}
      >
        Fipmoney
      </span>
    </div>
  );
}

