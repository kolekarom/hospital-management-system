"use client";
import { Suspense } from "react";
import { SettingsPage } from "@/components/ui/settings-page";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loading } from "@/components/ui/loading";

export default function PatientSettings() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading message="Loading settings..." />}>
        <SettingsPage defaultRole="patient" />
      </Suspense>
    </ErrorBoundary>
  );
}
