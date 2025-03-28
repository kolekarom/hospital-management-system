import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasJwt: !!process.env.PINATA_JWT,
    hasApiKey: !!process.env.NEXT_PUBLIC_PINATA_API_KEY,
    hasSecretKey: !!process.env.PINATA_SECRET_KEY,
  });
}
