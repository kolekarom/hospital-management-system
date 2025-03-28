"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
  stats: {
    totalRecords: number
    upcomingAppointments: number
    assignedDoctors: number
    unreadMessages: number
  }
  recentRecords: Array<{
    _id: string
    type: string
    date: string
    doctor: {
      name: string
    }
  }>
  nextAppointments: Array<{
    _id: string
    date: string
    doctor: {
      name: string
      specialization: string
    }
  }>
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function PatientDashboard() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/patient/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session])

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to your Patient Dashboard</h1>
      <p className="text-muted-foreground">Access your medical records, appointments, and chat with our assistant.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Medical Records"
          value={loading ? null : data?.stats.totalRecords?.toString() ?? '0'}
          description="Total records"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatsCard 
          title="Appointments" 
          value={loading ? null : data?.stats.upcomingAppointments?.toString() ?? '0'} 
          description="Upcoming" 
          icon={<Calendar className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Doctors" 
          value={loading ? null : data?.stats.assignedDoctors?.toString() ?? '0'} 
          description="Assigned to you" 
          icon={<User className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Messages" 
          value={loading ? null : data?.stats.unreadMessages?.toString() ?? '0'} 
          description="Unread" 
          icon={<MessageSquare className="h-5 w-5" />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>Your latest health records on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : data?.recentRecords.length === 0 ? (
              <p className="text-muted-foreground">No medical records found.</p>
            ) : (
              <div className="space-y-4">
                {data?.recentRecords.map((record) => (
                  <div key={record._id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{record.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(record.date)} • {record.doctor.name}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/patient/records/${record._id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/patient/records">View All Records</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments with doctors</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : data?.nextAppointments.length === 0 ? (
              <p className="text-muted-foreground">No upcoming appointments.</p>
            ) : (
              <div className="space-y-4">
                {data?.nextAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{appointment.doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.date)} • {appointment.doctor.specialization}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/patient/appointments/${appointment._id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/patient/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Chat with our AI assistant for guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our AI assistant can help you navigate the platform, understand your medical records, and answer common
            questions about your health data.
          </p>
          <Button asChild>
            <Link href="/dashboard/patient/chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | null
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
        </div>
        <div className="space-y-1">
          {value === null ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
