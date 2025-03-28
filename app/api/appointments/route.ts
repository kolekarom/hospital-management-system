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
    const date = searchParams.get('date')
    const view = searchParams.get('view') || 'day'

    let query: any = { doctor: token.sub }

    if (date) {
      const selectedDate = new Date(date)
      const startDate = new Date(selectedDate)
      startDate.setHours(0, 0, 0, 0)
      
      const endDate = new Date(selectedDate)
      if (view === 'day') {
        endDate.setHours(23, 59, 59, 999)
      } else if (view === 'week') {
        endDate.setDate(endDate.getDate() + 7)
      } else if (view === 'month') {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      query.dateTime = { $gte: startDate, $lt: endDate }
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone')
      .sort({ dateTime: 1 })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const token = await getToken({ req: request })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    data.doctor = token.sub

    const appointment = await Appointment.create(data)
    await appointment.populate('patient', 'name phone')

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
