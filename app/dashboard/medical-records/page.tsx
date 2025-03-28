import ViewMedicalRecords from '@/components/medical-records/view-medical-records';
import { MedicalRecordsProvider } from '@/contexts/medical-records-context';

export default function MedicalRecordsPage() {
  return (
    <MedicalRecordsProvider>
      <div className="container mx-auto py-8">
        <ViewMedicalRecords />
      </div>
    </MedicalRecordsProvider>
  );
}
