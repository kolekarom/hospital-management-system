"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, FileText, Activity, Pill } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/error-boundary";
import useSWR from "swr";

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  time: string;
  diagnosis: string;
  prescription: string[];
  symptoms: string[];
  status: "active" | "completed" | "scheduled";
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenLevel: string;
  };
}

interface ViewRecordProps {
  recordId: string;
}

// Mock fetcher function - replace with actual API call
const fetchRecord = async (id: string): Promise<MedicalRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id,
    patientName: "John Doe",
    patientId: "P12345",
    doctorName: "Dr. Sarah Smith",
    date: "2025-03-28",
    time: "14:30",
    diagnosis: "Common Cold with mild fever",
    prescription: ["Paracetamol 500mg", "Vitamin C 1000mg", "Cough Syrup"],
    symptoms: ["Fever", "Cough", "Runny Nose"],
    status: "active",
    vitals: {
      bloodPressure: "120/80",
      temperature: "38.2°C",
      heartRate: "72 bpm",
      oxygenLevel: "98%"
    }
  };
};

export function ViewRecord({ recordId }: ViewRecordProps) {
  const { data: record, error } = useSWR(recordId, fetchRecord);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load record</p>
      </div>
    );
  }

  if (!record) {
    return <Loading message="Loading medical record..." />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Medical Record</h2>
          <Badge variant={record.status === "active" ? "default" : "secondary"}>
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{record.patientName}</p>
                  <p className="text-sm text-muted-foreground">ID: {record.patientId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <p>{record.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p>{record.time}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="font-medium">{record.vitals.bloodPressure}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-medium">{record.vitals.temperature}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="font-medium">{record.vitals.heartRate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Oxygen Level</p>
                  <p className="font-medium">{record.vitals.oxygenLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">Diagnosis</p>
                </div>
                <p className="text-muted-foreground">{record.diagnosis}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">Symptoms</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.symptoms.map((symptom) => (
                    <Badge key={symptom} variant="outline">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prescription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Medications</p>
              </div>
              <ul className="list-disc list-inside space-y-2">
                {record.prescription.map((medicine) => (
                  <li key={medicine} className="text-muted-foreground">
                    {medicine}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Download PDF</Button>
          <Button>Share Record</Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
