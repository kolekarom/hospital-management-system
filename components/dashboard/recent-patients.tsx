"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlusCircle, FileText } from "lucide-react"

interface Patient {
  _id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export function RecentPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setPatients(data.recentPatients || [])
      } catch (error) {
        console.error('Failed to fetch patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient registrations</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/doctor/patients/add">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Patient
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-md animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-muted rounded" />
                  <div className="h-8 w-20 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : (
            patients.map((patient) => (
              <div key={patient._id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/doctor/patients/${patient._id}`}>View</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/doctor/records/add?patient=${patient._id}`}>
                      <FileText className="h-4 w-4 mr-1" /> Record
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/doctor/patients">View All Patients</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
