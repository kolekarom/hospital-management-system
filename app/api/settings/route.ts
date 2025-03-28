import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { Doctor } from '@/lib/db/models/Doctor'
import { getToken } from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'
import bcryptjs from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctor = await Doctor.findById(token.sub).select('-password')
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const allowedFields = [
      'name',
      'phone',
      'dateOfBirth',
      'gender',
      'specialization',
      'licenseNumber',
      'emergencyContact',
      'residentialAddress',
      'experience',
      'qualifications',
      'consultationFee',
      'availability',
      'notifications',
      'profileImage'
    ]

    // Filter out non-allowed fields
    const updateData = Object.keys(data).reduce((acc: any, key) => {
      if (allowedFields.includes(key)) {
        if (key === 'dateOfBirth') {
          acc[key] = new Date(data[key])
        } else if (key === 'consultationFee') {
          acc[key] = {
            amount: parseFloat(data[key]),
            currency: 'INR'
          }
        } else if (key === 'experience') {
          acc[key] = parseInt(data[key], 10)
        } else {
          acc[key] = data[key]
        }
      }
      return acc
    }, {})

    const doctor = await Doctor.findByIdAndUpdate(
      token.sub,
      { $set: updateData },
      { new: true }
    ).select('-password')

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    const doctor = await Doctor.findById(token.sub)
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcryptjs.compare(currentPassword, doctor.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10)
    doctor.password = hashedPassword
    await doctor.save()

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
