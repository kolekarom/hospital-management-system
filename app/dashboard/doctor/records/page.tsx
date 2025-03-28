<<<<<<< HEAD
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
=======
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileText, Search, Filter, Download } from "lucide-react"

interface MedicalRecord {
  _id: string
  patient: {
    _id: string
    name: string
  }
  date: string
  type: string
  diagnosis: string
  status: string
}

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filter, setFilter] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">
            View and manage patient medical records
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Records</CardTitle>
          <CardDescription>
            Search through patient records and filter by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or record ID"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter records" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Records List</CardTitle>
          <CardDescription>
            All medical records stored on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.patient.name}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
>>>>>>> 6fd188f (changes by om)
}
