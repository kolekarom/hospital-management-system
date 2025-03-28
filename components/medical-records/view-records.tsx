import { useState, useEffect } from 'react';
import { getFromIPFS } from '@/utils/pinata';

interface MedicalRecord {
  patientId: string;
  recordType: string;
  description: string;
  date: string;
  ipfsUrl?: string;
  fileType?: string;
}

interface ViewRecordsProps {
  ipfsHashes: string[]; // Array of IPFS hashes to display
}

export default function ViewMedicalRecords({ ipfsHashes }: ViewRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsData = await Promise.all(
          ipfsHashes.map(async (hash) => {
            const result = await getFromIPFS(hash);
            if (result.success && result.data) {
              return result.data as MedicalRecord;
            }
            return null;
          })
        );

        setRecords(recordsData.filter((record): record is MedicalRecord => record !== null));
      } catch (err) {
        setError('Failed to fetch medical records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [ipfsHashes]);

  const handleViewFile = async (ipfsUrl: string) => {
    try {
      const result = await getFromIPFS(ipfsUrl);
      if (result.success && result.data) {
        // Create a blob URL and open in new tab
        const blob = new Blob([result.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error viewing file:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Medical Records</h2>
      
      {records.length === 0 ? (
        <p className="text-gray-500">No records found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{record.recordType}</h3>
                  <p className="text-sm text-gray-500">Patient ID: {record.patientId}</p>
                </div>
                <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
              </div>
              
              <p className="text-gray-600 mb-4">{record.description}</p>
              
              {record.ipfsUrl && (
                <button
                  onClick={() => handleViewFile(record.ipfsUrl!)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Attached File
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
