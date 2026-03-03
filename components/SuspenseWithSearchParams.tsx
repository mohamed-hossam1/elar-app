"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SuspenseWithSearchParams({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  return (
    <Suspense key={searchParams.toString()} fallback={fallback}>
      {children}
    </Suspense>
  );
}
