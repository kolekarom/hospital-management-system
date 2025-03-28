"use client"

import { useState } from "react"
import { patients, Patient } from "@/data/patients"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [patientData, setPatientData] = useState<Patient | null>(null)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowOtpDialog(true)
    // In a real app, this would trigger an API call to send OTP to patient's email
    console.log(`Sending OTP to ${patient.email}`)
  }

  const handleOtpVerification = () => {
    setVerificationStatus("pending")
    // Simulate OTP verification
    setTimeout(() => {
      // In a real app, this would be an API call to verify OTP
      if (otp === "123456") { // Demo OTP
        setVerificationStatus("success")
        setPatientData(selectedPatient)
      } else {
        setVerificationStatus("error")
      }
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Search Patients</h2>
        <p className="text-muted-foreground">
          Search for patients by name or ID
        </p>
      </div>

      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Enter patient name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle>{patient.name}</CardTitle>
              <CardDescription>ID: {patient.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Email: {patient.email}</p>
              <p>Contact: {patient.contactNumber}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handlePatientSelect(patient)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Verification Required</DialogTitle>
            <DialogDescription>
              An OTP has been sent to {selectedPatient?.email}. 
              Please enter it below to access patient information.
              (Use 123456 for demo)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {verificationStatus === "error" && (
              <p className="text-sm text-red-500">
                Invalid OTP. Please try again.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleOtpVerification}
              disabled={verificationStatus === "pending"}
            >
              {verificationStatus === "pending" ? "Verifying..." : "Verify OTP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {patientData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Verified patient details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <p>Name: {patientData.name}</p>
                  <p>ID: {patientData.id}</p>
                  <p>Gender: {patientData.gender}</p>
                  <p>Blood Group: {patientData.bloodGroup}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Contact Information</h4>
                  <p>Email: {patientData.email}</p>
                  <p>Phone: {patientData.contactNumber}</p>
                  <p>Address: {patientData.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Allergies</h4>
                <ul className="list-disc list-inside">
                  {patientData.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Medical History</h4>
                {patientData.medicalHistory.map((record, index) => (
                  <div key={index} className="border rounded p-3 mb-2">
                    <p><strong>Condition:</strong> {record.condition}</p>
                    <p><strong>Status:</strong> {record.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
