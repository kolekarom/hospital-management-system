import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import { Prescription } from '@/lib/db/models/Prescription'
import { getToken } from 'next-auth/jwt'

export async function GET(request: Request) {
  try {
    await connectDB()
    const token = await getToken({ req: request as any })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query: any = { doctor: token.sub }

    if (search) {
      query.$or = [
        { 'patient.name': { $regex: search, $options: 'i' } },
        { 'diagnosis.primary': { $regex: search, $options: 'i' } }
      ]
    }

    if (type && type !== 'all') {
      query.type = type
    }

    const skip = (page - 1) * limit

    const [records, total] = await Promise.all([
      Prescription.find(query)
        .populate('patient', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prescription.countDocuments(query)
    ])

    return NextResponse.json({
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Records error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const token = await getToken({ req: request as any })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    data.doctor = token.sub

    const record = await Prescription.create(data)
    await record.populate('patient', 'name')

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Create record error:', error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
