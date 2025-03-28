"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PlusCircle,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  VideoIcon,
  Activity,
  Pill
} from "lucide-react"

const actions = [
  {
    title: "Add Patient",
    description: "Register a new patient",
    icon: <PlusCircle className="h-6 w-6" />,
    href: "/dashboard/doctor/patients/add",
    color: "text-blue-600"
  },
  {
    title: "New Record",
    description: "Create medical record",
    icon: <FileText className="h-6 w-6" />,
    href: "/dashboard/doctor/records/add",
    color: "text-green-600"
  },
  {
    title: "Schedule",
    description: "Manage appointments",
    icon: <Calendar className="h-6 w-6" />,
    href: "/dashboard/doctor/appointments",
    color: "text-purple-600"
  },
  {
    title: "Messages",
    description: "Chat with patients",
    icon: <MessageSquare className="h-6 w-6" />,
    href: "/dashboard/doctor/messages",
    color: "text-orange-600"
  },
  {
    title: "Video Call",
    description: "Start consultation",
    icon: <VideoIcon className="h-6 w-6" />,
    href: "/dashboard/doctor/video-call",
    color: "text-red-600"
  },
  {
    title: "Prescriptions",
    description: "Write prescriptions",
    icon: <Pill className="h-6 w-6" />,
    href: "/dashboard/doctor/prescriptions",
    color: "text-teal-600"
  },
  {
    title: "Analytics",
    description: "View insights",
    icon: <Activity className="h-6 w-6" />,
    href: "/dashboard/doctor/analytics",
    color: "text-indigo-600"
  },
  {
    title: "Settings",
    description: "Manage account",
    icon: <Settings className="h-6 w-6" />,
    href: "/dashboard/doctor/settings",
    color: "text-gray-600"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
              asChild
            >
              <Link href={action.href}>
                <div className={action.color}>{action.icon}</div>
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
