import { useState } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from '@/utils/pinata';

interface MedicalRecord {
  patientId: string;
  recordType: string;
  description: string;
  date: string;
  ipfsUrl?: string;
  fileType?: string;
}

export default function UploadMedicalRecord() {
  const [isUploading, setIsUploading] = useState(false);
  const [record, setRecord] = useState<MedicalRecord>({
    patientId: '',
    recordType: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage('');

    try {
      // First upload the file if present
      let fileIpfsUrl = '';
      if (file) {
        const fileUploadResult = await uploadFileToIPFS(file);
        if (!fileUploadResult.success) {
          throw new Error('Failed to upload file to IPFS');
        }
        fileIpfsUrl = fileUploadResult.pinataUrl || '';
      }

      // Create the record data
      const recordData: MedicalRecord = {
        ...record,
        ipfsUrl: fileIpfsUrl,
        fileType: file?.type
      };

      // Upload the record metadata to IPFS
      const metadataUploadResult = await uploadJSONToIPFS(recordData);
      if (!metadataUploadResult.success) {
        throw new Error('Failed to upload record metadata to IPFS');
      }

      setMessage('Record uploaded successfully!');
      // Reset form
      setRecord({
        patientId: '',
        recordType: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setFile(null);
      
      // You would typically save the IPFS hash (metadataUploadResult.pinataUrl) to your database here
      
    } catch (err) {
      const error = err as Error;
      setMessage('Error uploading record: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Upload Medical Record</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            required
            value={record.patientId}
            onChange={(e) => setRecord({ ...record, patientId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Record Type</label>
          <select
            required
            value={record.recordType}
            onChange={(e) => setRecord({ ...record, recordType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Type</option>
            <option value="prescription">Prescription</option>
            <option value="lab_result">Lab Result</option>
            <option value="imaging">Imaging</option>
            <option value="diagnosis">Diagnosis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={record.description}
            onChange={(e) => setRecord({ ...record, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            value={record.date}
            onChange={(e) => setRecord({ ...record, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Record'}
        </button>
      </form>
    </div>
  );
}
