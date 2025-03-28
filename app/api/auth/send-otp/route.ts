import { NextResponse } from 'next/server';
import { generateOTP, isOTPExpired } from '@/utils/otp';
import { sendOTPEmail } from '@/utils/email';

// In a real app, use a database to store OTPs
const otpStore = new Map<string, { otp: string; createdAt: Date }>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with timestamp
    otpStore.set(email, {
      otp,
      createdAt: new Date(),
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email || !otp) {
    return NextResponse.json(
      { error: 'Email and OTP are required' },
      { status: 400 }
    );
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return NextResponse.json(
      { error: 'No OTP found for this email' },
      { status: 400 }
    );
  }

  const { otp: storedOtp, createdAt } = storedData;

  // Check if OTP is expired
  if (isOTPExpired(createdAt)) {
    otpStore.delete(email); // Clean up expired OTP
    return NextResponse.json(
      { error: 'OTP has expired' },
      { status: 400 }
    );
  }

  // Verify OTP
  if (otp !== storedOtp) {
    return NextResponse.json(
      { error: 'Invalid OTP' },
      { status: 400 }
    );
  }

  // Clean up used OTP
  otpStore.delete(email);

  return NextResponse.json({ success: true });
}
