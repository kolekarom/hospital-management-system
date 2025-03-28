import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { getToken } from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'
import { Patient } from '@/lib/db/models/Patient'
import { MedicalRecord } from '@/lib/db/models/MedicalRecord'
import { Appointment } from '@/lib/db/models/Appointment'
import { Message } from '@/lib/db/models/Message'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patientId = token.sub

    // Get total medical records count
    const totalRecords = await MedicalRecord.countDocuments({ patient: patientId })

    // Get upcoming appointments count
    const upcomingAppointments = await Appointment.countDocuments({
      patient: patientId,
      date: { $gte: new Date() },
      status: { $nin: ['cancelled', 'completed'] }
    })

    // Get assigned doctors count
    const assignedDoctors = await Appointment.distinct('doctor', {
      patient: patientId,
      status: { $nin: ['cancelled'] }
    }).then(doctors => doctors.length)

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      recipient: patientId,
      read: false
    })

    // Get recent medical records
    const recentRecords = await MedicalRecord.find({ patient: patientId })
      .sort({ date: -1 })
      .limit(3)
      .populate('doctor', 'name')
      .lean()

    // Get upcoming appointments
    const nextAppointments = await Appointment.find({
      patient: patientId,
      date: { $gte: new Date() },
      status: { $nin: ['cancelled', 'completed'] }
    })
      .sort({ date: 1 })
      .limit(3)
      .populate('doctor', 'name specialization')
      .lean()

    return NextResponse.json({
      stats: {
        totalRecords,
        upcomingAppointments,
        assignedDoctors,
        unreadMessages
      },
      recentRecords,
      nextAppointments
    })
  } catch (error) {
    console.error('Patient dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
