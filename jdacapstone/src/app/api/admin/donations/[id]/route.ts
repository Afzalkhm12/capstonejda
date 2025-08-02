import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/lib/auth";

export const runtime = 'nodejs'; 

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { status } = await request.json();
    const { id } = await params;
    const donationId = parseInt(id, 10);

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