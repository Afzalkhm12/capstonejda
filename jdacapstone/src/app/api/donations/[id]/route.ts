import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import NextAuth from 'next-auth';
import { authConfig } from "@/lib/auth";
export const runtime = 'nodejs';

const { auth } = NextAuth(authConfig);

async function handlePatch(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth(); 
  if (session?.user?.role !== 'admin') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { status } = await req.json();
    const donationId = parseInt(params.id, 10);

    if (isNaN(donationId)) {
        return new NextResponse(JSON.stringify({ message: 'Invalid donation ID' }), { status: 400 });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: { status },
    });

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error("Failed to update donation status:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal memperbarui status donasi" }), { status: 500 });
  }
}
export { handlePatch as PATCH };