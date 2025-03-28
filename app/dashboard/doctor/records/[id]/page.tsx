import { Suspense } from "react";
import { ViewRecord } from "@/components/records/view-record";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loading } from "@/components/ui/loading";

interface ViewRecordPageProps {
  params: {
    id: string;
  };
}

export default async function ViewRecordPage({ params }: ViewRecordPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading message="Loading medical record..." />}>
        <ViewRecord recordId={params.id} />
      </Suspense>
    </ErrorBoundary>
  );
}
