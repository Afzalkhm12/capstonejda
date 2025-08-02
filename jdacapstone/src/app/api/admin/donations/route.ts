import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import NextAuth from 'next-auth'; 
import { authConfig } from '@/lib/auth';
export const runtime = 'nodejs';

const { auth } = NextAuth(authConfig);

export const GET = auth(async (req) => { 
  if (req.auth?.user?.role !== 'admin') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Gagal mengambil data donasi:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data donasi" }), { status: 500 });
  }
});