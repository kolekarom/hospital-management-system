import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { Patient } from '@/lib/db/models/Patient';
import { Appointment } from '@/lib/db/models/Appointment';
import { Prescription } from '@/lib/db/models/Prescription';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get doctor ID from session (implement authentication first)
    const doctorId = '...'; // TODO: Get from session

    // Get current date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch stats in parallel
    const [
      totalPatients,
      todayAppointments,
      totalAppointments,
      totalPrescriptions,
      recentPatients,
      upcomingAppointments
    ] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({
        doctor: doctorId,
        dateTime: { $gte: today, $lt: tomorrow }
      }),
      Appointment.countDocuments({ doctor: doctorId }),
      Prescription.countDocuments({ doctor: doctorId }),
      Patient.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email phone createdAt'),
      Appointment.find({
        doctor: doctorId,
        dateTime: { $gte: today }
      })
        .sort({ dateTime: 1 })
        .limit(5)
        .populate('patient', 'name')
    ]);

    return NextResponse.json({
      stats: {
        totalPatients,
        todayAppointments,
        totalAppointments,
        totalPrescriptions
      },
      recentPatients,
      upcomingAppointments
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
