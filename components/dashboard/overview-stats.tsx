"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Calendar, Users, Stethoscope, IndianRupee, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  totalPatients: number
  todayAppointments: number
  totalAppointments: number
  totalPrescriptions: number
  totalEarnings?: number
  unreadMessages?: number
}

export function OverviewStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: <Users className="h-5 w-5" />,
      description: "Registered patients",
      loading
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: <Calendar className="h-5 w-5" />,
      description: "Scheduled for today",
      loading
    },
    {
      title: "Total Records",
      value: stats?.totalPrescriptions || 0,
      icon: <FileText className="h-5 w-5" />,
      description: "Medical records",
      loading
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      icon: <Stethoscope className="h-5 w-5" />,
      description: "All time",
      loading
    },
    {
      title: "Total Earnings",
      value: stats?.totalEarnings || 0,
      icon: <IndianRupee className="h-5 w-5" />,
      description: "This month",
      loading,
      prefix: "₹"
    },
    {
      title: "Messages",
      value: stats?.unreadMessages || 0,
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Unread",
      loading
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                {stat.loading ? (
                  <div className="h-8 w-16 animate-pulse bg-muted rounded" />
                ) : (
                  <p className="text-3xl font-bold">
                    {stat.prefix}
                    {stat.value.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className="rounded-full p-2.5 bg-muted">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
