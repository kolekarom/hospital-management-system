import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { Appointment } from '@/lib/db/models/Appointment'
import { Patient } from '@/lib/db/models/Patient'
import { Prescription } from '@/lib/db/models/Prescription'
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
    const timeRange = searchParams.get('timeRange') || 'week'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get statistics in parallel
    const [
      totalPatients,
      newPatients,
      totalAppointments,
      completedAppointments,
      totalEarnings,
      appointmentsByDay,
      consultationTypes,
      patientDemographics,
      earningsData
    ] = await Promise.all([
      // Total patients
      Patient.countDocuments({ doctor: token.sub }),
      
      // New patients in time range
      Patient.countDocuments({
        doctor: token.sub,
        createdAt: { $gte: startDate, $lte: now }
      }),

      // Total appointments
      Appointment.countDocuments({
        doctor: token.sub,
        dateTime: { $gte: startDate, $lte: now }
      }),

      // Completed appointments
      Appointment.countDocuments({
        doctor: token.sub,
        dateTime: { $gte: startDate, $lte: now },
        status: 'Completed'
      }),

      // Total earnings
      Appointment.aggregate([
        {
          $match: {
            doctor: token.sub,
            dateTime: { $gte: startDate, $lte: now },
            status: 'Completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$fee.amount' }
          }
        }
      ]),

      // Appointments by day
      Appointment.aggregate([
        {
          $match: {
            doctor: token.sub,
            dateTime: { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),

      // Consultation types distribution
      Appointment.aggregate([
        {
          $match: {
            doctor: token.sub,
            dateTime: { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),

      // Patient demographics
      Patient.aggregate([
        {
          $match: {
            doctor: token.sub
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: ['$age', 18] }, then: '0-18' },
                  { case: { $lte: ['$age', 35] }, then: '19-35' },
                  { case: { $lte: ['$age', 50] }, then: '36-50' },
                  { case: { $lte: ['$age', 65] }, then: '51-65' }
                ],
                default: '65+'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),

      // Earnings data
      Appointment.aggregate([
        {
          $match: {
            doctor: token.sub,
            dateTime: { $gte: startDate, $lte: now },
            status: 'Completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dateTime'
              }
            },
            earnings: { $sum: '$fee.amount' }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ])

    return NextResponse.json({
      overview: {
        totalPatients,
        newPatients,
        totalAppointments,
        completedAppointments,
        totalEarnings: totalEarnings[0]?.total || 0
      },
      charts: {
        appointmentsByDay: appointmentsByDay.map(day => ({
          name: day._id,
          appointments: day.count
        })),
        consultationTypes: consultationTypes.map(type => ({
          name: type._id,
          value: type.count
        })),
        patientDemographics: patientDemographics.map(demo => ({
          name: demo._id,
          value: demo.count
        })),
        earningsData: earningsData.map(earning => ({
          name: earning._id,
          earnings: earning.earnings
        }))
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
