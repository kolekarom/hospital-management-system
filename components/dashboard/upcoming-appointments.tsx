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
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  _id: string
  dateTime: string
  type: string
  status: string
  patient: {
    _id: string
    name: string
  }
}

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setAppointments(data.upcomingAppointments || [])
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/doctor/appointments">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-md animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-5 w-20 bg-muted rounded" />
                </div>
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            ))
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="p-3 border rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(appointment.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{appointment.patient.name}</p>
                <p className="text-xs text-muted-foreground">{appointment.type}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/doctor/appointments">Full Schedule</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
