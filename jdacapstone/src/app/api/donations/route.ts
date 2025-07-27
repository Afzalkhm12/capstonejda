import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
// Perbaikan path impor untuk authOptions
import { authOptions } from "@/app/api/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to fetch donations" }), { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validasi data yang masuk
    if (!data.foodType || !data.quantity || !data.expiryDate || !data.address) {
        return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const newDonation = await prisma.donation.create({
      data: {
        foodType: data.foodType,
        quantity: data.quantity,
        expiryDate: new Date(data.expiryDate), // Konversi string tanggal menjadi objek Date
        address: data.address,
        userId: session.user.id,
      },
    });
    return new NextResponse(JSON.stringify(newDonation), { status: 201 });
  } catch (error) {
    console.error("Failed to create donation:", error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create donation' }), { status: 500 });
  }
}
