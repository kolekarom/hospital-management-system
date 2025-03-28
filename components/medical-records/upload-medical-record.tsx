'use client';

import { useState, useRef } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from '@/utils/pinata';
import { validateFile } from '@/utils/file-validation';
import { useMedicalRecords } from '@/contexts/medical-records-context';
import { useRouter } from 'next/navigation';

interface MedicalRecord {
  patientId: string;
  doctorId: string;
  recordType: string;
  description: string;
  date: string;
  fileIpfsHash?: string;
}

export default function UploadMedicalRecord() {
  const router = useRouter();
  const { addRecord } = useMedicalRecords();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [record, setRecord] = useState<MedicalRecord>({
    patientId: '',
    doctorId: '',
    recordType: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (!validation.isValid) {
        setMessage(validation.error || 'Invalid file');
        e.target.value = ''; // Reset file input
        return;
      }

      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage('');

    try {
      // First upload the file if present
      let fileIpfsHash = '';
      if (file) {
        const fileUploadResult = await uploadFileToIPFS(file);
        if (!fileUploadResult.success) {
          throw new Error(fileUploadResult.message || 'Failed to upload medical record file');
        }
        fileIpfsHash = fileUploadResult.pinataUrl || '';
      }

      // Create record data with file hash
      const recordData = {
        ...record,
        fileIpfsHash,
        timestamp: new Date().toISOString()
      };

      // Upload record data to IPFS
      const recordUploadResult = await uploadJSONToIPFS(recordData);
      if (!recordUploadResult.success) {
        throw new Error(recordUploadResult.message || 'Failed to upload medical record data');
      }

      // Add record to context
      await addRecord(recordUploadResult.pinataUrl!);

      setMessage('Medical record uploaded successfully!');
      
      // Reset form
      setRecord({
        patientId: '',
        doctorId: '',
        recordType: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to records view after successful upload
      router.push('/dashboard/medical-records');
      
    } catch (err) {
      const error = err as Error;
      setMessage(error.message);
      console.error('Error in medical record upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Medical Record</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.includes('success') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            value={record.patientId}
            onChange={(e) => setRecord({ ...record, patientId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
          <input
            type="text"
            value={record.doctorId}
            onChange={(e) => setRecord({ ...record, doctorId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Record Type</label>
          <select
            value={record.recordType}
            onChange={(e) => setRecord({ ...record, recordType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Record Type</option>
            <option value="prescription">Prescription</option>
            <option value="lab_report">Lab Report</option>
            <option value="imaging">Imaging</option>
            <option value="clinical_notes">Clinical Notes</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={record.description}
            onChange={(e) => setRecord({ ...record, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={record.date}
            onChange={(e) => setRecord({ ...record, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Record File</label>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1 block w-full"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <p className="mt-1 text-sm text-gray-500">
            Accepted formats: PDF, Images (JPG, PNG), Documents (DOC, DOCX). Maximum size: 10MB
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Medical Record'}
        </button>
      </form>
    </div>
  );
}
