"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Check, Wallet } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function DoctorSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    specialization: "",
    licenseNumber: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would be an API call to create the doctor account
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success screen instead of redirecting
      setShowSuccess(true)
    } catch (error) {
      console.error("Signup failed:", error)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        // In a real app, you would associate this wallet with the doctor's account
        setTimeout(() => {
          router.push('/dashboard/doctor')
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to connect:', error)
      setError('Failed to connect to MetaMask. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-6">
  <Card className="w-full max-w-md shadow-lg">
    <CardHeader className="space-y-1">
      <div className="flex justify-center mb-4">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-7 w-7 text-green-600" />
        </div>
      </div>
      <CardTitle className="text-2xl text-center">Registration Successful!</CardTitle>
      <CardDescription className="text-center">
        Connect your MetaMask wallet to complete the setup
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Image src="/metamask-fox.svg" alt="MetaMask" width={40} height={40} />
          <h3 className="text-lg font-semibold text-orange-700">Connect MetaMask</h3>
        </div>
        <p className="text-sm text-orange-600 text-center mb-4">
          To ensure secure access to your account, please connect your MetaMask wallet.
        </p>
        {account ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Connected with</p>
            <p className="font-mono bg-white p-2 rounded border border-orange-300">
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </p>
            <p className="text-sm text-green-600 mt-2">Redirecting to dashboard...</p>
          </div>
        ) : (
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all"
            onClick={connectWallet}
            disabled={isLoading}
          >
            <Wallet className="mr-2 h-5 w-5" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
</div>

    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Doctor Registration</CardTitle>
          <CardDescription className="text-center">
            Create your account to join our medical platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Dr. John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Cardiology, Pediatrics"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Medical License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="Enter your medical license number"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login/doctor" className="text-primary hover:underline">
              Log in here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
