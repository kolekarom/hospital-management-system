"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Plus, FileText } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

// Mock data for records
const mockRecords = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "P12345",
    date: "2025-03-28",
    diagnosis: "Common Cold",
    status: "active",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    patientId: "P12346",
    date: "2025-03-27",
    diagnosis: "Hypertension",
    status: "completed",
  },
];

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const role = pathname?.split("/")[2] || "doctor"; // Get role from URL with fallback

  const filteredRecords = mockRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <Button asChild>
            <Link href={`/dashboard/${role}/records/add`}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Record
            </Link>
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{record.patientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {record.patientId}
                    </p>
                  </div>
                  <Badge
                    variant={record.status === "active" ? "default" : "secondary"}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {record.date}
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/${role}/records/${record.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Record
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
