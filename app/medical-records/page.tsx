'use client';

import UploadMedicalRecord from '@/components/medical-records/upload-record';
import ViewMedicalRecords from '@/components/medical-records/view-records';
import { useState } from 'react';

export default function MedicalRecordsPage() {
  // In a real application, you would fetch these from your database
  const [ipfsHashes, setIpfsHashes] = useState<string[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medical Records Management</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <UploadMedicalRecord />
        </div>
        
        <div>
          <ViewMedicalRecords ipfsHashes={ipfsHashes} />
        </div>
      </div>
    </div>
  );
}
