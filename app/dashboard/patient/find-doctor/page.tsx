"use client"

import { useState } from "react"
import { doctors, Doctor } from "@/data/doctors"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

export default function FindDoctor() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(value.toLowerCase()) ||
        doctor.address.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredDoctors(filtered)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Find a Doctor</h2>
        <p className="text-muted-foreground">
          Search for doctors by name, specialization, or location
        </p>
      </div>

      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <p className="font-medium text-primary">
                    {doctor.specialization}
                  </p>
                  <p>{doctor.education}</p>
                  <p>{doctor.experience} years experience</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.address}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{doctor.rating}</span>
                  </div>
                  <div className="text-sm">
                    <p>Available:</p>
                    {doctor.availability.map((time, index) => (
                      <p key={index} className="text-muted-foreground">
                        {time}
                      </p>
                    ))}
                  </div>
                </div>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
