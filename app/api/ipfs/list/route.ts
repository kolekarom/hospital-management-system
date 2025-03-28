import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    // Build the where clause based on filters
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cid: { contains: search, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.iPFSData.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('IPFS list API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IPFS data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { cid, name, type, size, metadata } = await req.json();

    const item = await prisma.iPFSData.create({
      data: {
        cid,
        name,
        type,
        size,
        metadata
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('IPFS create API error:', error);
    return NextResponse.json(
      { error: 'Failed to create IPFS data entry' },
      { status: 500 }
    );
  }
}
