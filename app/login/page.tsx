"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams?.get('role') || 'patient'

  useEffect(() => {
    // Redirect based on role
    if (role === 'doctor') {
      router.push('/login/doctor')
    } else {
      // For patients, show regular login form
      router.push('/dashboard/patient')
    }
  }, [role, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
