'use client';

import { useState } from 'react';
import { useMedicalRecords } from '@/contexts/medical-records-context';
import { useUser } from '@/contexts/user-context';
import type { MedicalRecord } from '@/contexts/medical-records-context';

export default function ViewMedicalRecords() {
  const { records, loading, deleteRecord, searchRecords } = useMedicalRecords();
  const { user, hasPermission } = useUser();
  const [filter, setFilter] = useState({
    patientId: '',
    doctorId: '',
    recordType: '',
    searchQuery: ''
  });

  // Apply filters and search
  const filteredRecords = searchRecords(filter.searchQuery).filter((record: MedicalRecord) => {
    const matchesPatient = !filter.patientId || record.patientId.includes(filter.patientId);
    const matchesDoctor = !filter.doctorId || record.doctorId.includes(filter.doctorId);
    const matchesType = !filter.recordType || record.recordType === filter.recordType;

    // Access control for viewing records
    const canViewRecord = 
      hasPermission('view', 'all') ||
      (hasPermission('view', 'medical_records') && record.doctorId === user?.id) ||
      (hasPermission('view', 'own_medical_records') && record.patientId === user?.id);

    return matchesPatient && matchesDoctor && matchesType && canViewRecord;
  });

  const handleDelete = async (id: string, doctorId: string) => {
    const canDelete = 
      hasPermission('delete', 'all') ||
      (hasPermission('delete', 'own_medical_records') && doctorId === user?.id);

    if (!canDelete) {
      alert('You do not have permission to delete this record');
      return;
    }

    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      deleteRecord(id);
    }
  };

  const openIPFSFile = (ipfsHash: string) => {
    if (!ipfsHash) return;
    const hash = ipfsHash.replace("ipfs://", "");
    window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Medical Records</h2>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Search Records</label>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search in all fields..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="text"
              value={filter.patientId}
              onChange={(e) => setFilter(prev => ({ ...prev, patientId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Filter by Patient ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
            <input
              type="text"
              value={filter.doctorId}
              onChange={(e) => setFilter(prev => ({ ...prev, doctorId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Filter by Doctor ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Record Type</label>
            <select
              value={filter.recordType}
              onChange={(e) => setFilter(prev => ({ ...prev, recordType: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="prescription">Prescription</option>
              <option value="lab_report">Lab Report</option>
              <option value="imaging">Imaging</option>
              <option value="clinical_notes">Clinical Notes</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="text-center py-4">Loading records...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No medical records found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record: MedicalRecord) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.patientId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.doctorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.recordType.replace('_', ' ').charAt(0).toUpperCase() + record.recordType.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {record.fileIpfsHash && (
                      <button
                        onClick={() => openIPFSFile(record.fileIpfsHash!)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View File
                      </button>
                    )}
                    {(hasPermission('delete', 'all') || 
                      (hasPermission('delete', 'own_medical_records') && record.doctorId === user?.id)) && (
                      <button
                        onClick={() => handleDelete(record.id, record.doctorId)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
