import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { Appointment } from '@/lib/db/models/Appointment'
import { getToken } from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'upcoming'

    const now = new Date()
    let query: any = { 
      doctor: token.sub,
      type: 'Video'
    }

    if (status === 'upcoming') {
      query.dateTime = { $gte: now }
      query.status = { $in: ['Scheduled', 'Confirmed'] }
    } else if (status === 'completed') {
      query.status = 'Completed'
    }

    const consultations = await Appointment.find(query)
      .populate('patient', 'name photo')
      .sort({ dateTime: status === 'upcoming' ? 1 : -1 })
      .limit(10)

    return NextResponse.json(consultations)
  } catch (error) {
    console.error('Video consultations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video consultations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request }) as JWT & { role: string }

    if (!token || token.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { appointmentId, action } = data

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: token.sub
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (action === 'start') {
      appointment.status = 'In Progress'
    } else if (action === 'end') {
      appointment.status = 'Completed'
    }

    await appointment.save()
    await appointment.populate('patient', 'name photo')

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Video consultation action error:', error)
    return NextResponse.json(
      { error: 'Failed to update video consultation' },
      { status: 500 }
    )
  }
}
