"use client"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function DoctorLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [account, setAccount] = useState<string>('')
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  useEffect(() => {
    checkMetaMaskInstallation()
  }, [])

  const checkMetaMaskInstallation = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true)
    }
  }

  const [otpError, setOtpError] = useState<string>('')
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  const startResendTimer = () => {
    setCanResendOtp(false)
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResendOtp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        // In a real app, you would verify the doctor's address against your smart contract
        // For now, we'll simulate a successful authentication
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

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true)
    try {
      // In a real app, this would integrate with social login providers
      console.log(`Logging in with ${provider}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard/doctor")
    } catch (error) {
      console.error(`${provider} login failed:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Image */}
        <div className="relative hidden lg:block lg:w-1/2">
          <Image
            src="/doctor-consulting.jpg"
            alt="Doctor consulting with patient"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20" />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Doctor Login</CardTitle>
          <CardDescription className="text-center">
            Connect with MetaMask to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isMetaMaskInstalled ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                MetaMask is not installed. Please install MetaMask to continue.
              </p>
              <Button asChild className="w-full">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install MetaMask
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {account ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Connected with</p>
                  <p className="font-mono bg-gray-100 p-2 rounded">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={connectWallet}
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect with MetaMask"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            New doctor?{" "}
            <a href="/signup/doctor" className="text-primary hover:underline">
              Sign up here
            </a>
          </p>
        </CardFooter>
        </div>
      </div>
    </div>
  )
}
