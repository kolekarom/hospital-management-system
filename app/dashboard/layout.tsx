"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Database,
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [account, setAccount] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated with MetaMask
    const checkAuth = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length === 0) {
            // Not connected, redirect to login
            router.push("/login")
            return
          }

          setAccount(accounts[0])

          // Determine role based on path
          // In a real app, you would get this from your smart contract
          const pathParts = pathname?.split("/") || [];
          const roleFromPath = pathParts[2];
          
          if (roleFromPath === "admin" || roleFromPath === "doctor" || roleFromPath === "patient") {
            setRole(roleFromPath);
          } else {
            setRole("patient"); // Default role
          }
        } catch (error) {
          console.error("Failed to check authentication", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    // In a real app, you would handle disconnecting from MetaMask
    router.push("/login")
  }

  // Get menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        icon: Home,
        path: `/dashboard/${role}`,
      },
      {
        name: "Profile",
        icon: User,
        path: `/dashboard/${role}/profile`,
      },
      {
        name: "Chat Assistant",
        icon: MessageSquare,
        path: `/dashboard/${role}/chat`,
      },
      {
        name: "Settings",
        icon: Settings,
        path: `/dashboard/${role}/settings`,
      },
    ]

    // Add role-specific menu items
    switch (role) {
      case "admin":
        return [
          ...baseItems,
          {
            name: "Users",
            icon: Users,
            path: `/dashboard/admin/users`,
          },
          {
            name: "Database",
            icon: Database,
            path: `/dashboard/admin/database`,
          },
        ]
      case "doctor":
        return [
          ...baseItems,
          {
            name: "Appointments",
            icon: Calendar,
            path: `/dashboard/doctor/appointments`,
          },
          {
            name: "Records",
            icon: FileText,
            path: `/dashboard/doctor/records`,
          },
          {
            name: "Add Record",
            icon: PlusCircle,
            path: `/dashboard/doctor/records/add`,
          },
        ]
      case "patient":
        return [
          ...baseItems,
          {
            name: "Appointments",
            icon: Calendar,
            path: `/dashboard/patient/appointments`,
          },
          {
            name: "Medical Records",
            icon: FileText,
            path: `/dashboard/patient/records`,
          },
        ]
      default:
        return baseItems
    }
  }

  if (!account || !role) {
    return null // or a loading state
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Hospital Management</h2>
            <p className="text-sm text-muted-foreground">
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <Link
                  href={item.path}
                  key={item.path}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
          <SidebarTrigger />
        </Sidebar>
        <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
      </div>
    </SidebarProvider>
  )
}
