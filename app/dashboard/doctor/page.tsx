"use client"

import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DoctorDashboard() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage patients, appointments, and medical records securely with blockchain technology.
          </p>
        </div>
      </div>

      <OverviewStats />

      <QuickActions />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentPatients />
        </div>
        <div>
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  )
}

