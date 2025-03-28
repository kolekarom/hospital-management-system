'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromIPFS } from '@/utils/pinata';

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  recordType: string;
  description: string;
  date: string;
  fileIpfsHash?: string;
  timestamp: string;
  keywords?: string[];
}

interface MedicalRecordsContextType {
  records: MedicalRecord[];
  addRecord: (ipfsHash: string) => Promise<void>;
  deleteRecord: (id: string) => void;
  getRecordsByPatient: (patientId: string) => MedicalRecord[];
  getRecordsByDoctor: (doctorId: string) => MedicalRecord[];
  searchRecords: (query: string) => MedicalRecord[];
  loading: boolean;
}

const MedicalRecordsContext = createContext<MedicalRecordsContextType | undefined>(undefined);

export function MedicalRecordsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load records from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('medicalRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medicalRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = async (ipfsHash: string) => {
    try {
      setLoading(true);
      const result = await getFromIPFS(ipfsHash);
      if (result.success && result.data) {
        const recordData = result.data;
        // Generate keywords for search
        const keywords = [
          recordData.patientId,
          recordData.doctorId,
          recordData.recordType,
          recordData.description,
          recordData.date,
        ].filter(Boolean).map(str => str.toLowerCase());

        const newRecord = {
          id: ipfsHash,
          ...recordData,
          keywords
        };
        setRecords(prev => [...prev, newRecord]);
      }
    } catch (error) {
      console.error('Error loading medical record:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const getRecordsByPatient = (patientId: string) => {
    return records.filter(record => record.patientId === patientId);
  };

  const getRecordsByDoctor = (doctorId: string) => {
    return records.filter(record => record.doctorId === doctorId);
  };

  const searchRecords = (query: string) => {
    if (!query.trim()) return records;
    
    const searchTerms = query.toLowerCase().split(' ');
    return records.filter(record => {
      const recordText = record.keywords?.join(' ') || '';
      return searchTerms.every(term => recordText.includes(term));
    });
  };

  return (
    <MedicalRecordsContext.Provider
      value={{
        records,
        addRecord,
        deleteRecord,
        getRecordsByPatient,
        getRecordsByDoctor,
        searchRecords,
        loading
      }}
    >
      {children}
    </MedicalRecordsContext.Provider>
  );
}

export function useMedicalRecords() {
  const context = useContext(MedicalRecordsContext);
  if (context === undefined) {
    throw new Error('useMedicalRecords must be used within a MedicalRecordsProvider');
  }
  return context;
}
