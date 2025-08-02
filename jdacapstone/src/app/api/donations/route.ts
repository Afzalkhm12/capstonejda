import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendDonationConfirmationEmail, sendDonationNotificationEmail } from '@/lib/mail';

export async function GET() {
  const session = await getServerSession(authOptions);
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
    console.error("Gagal mengambil donasi:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil donasi" }), { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  try {
    const data = await request.json();
    if (!data.foodType || !data.quantity || !data.expiryDate || !data.address) {
        return new NextResponse(JSON.stringify({ message: 'Data yang dibutuhkan tidak lengkap' }), { status: 400 });
    }
    const newDonation = await prisma.donation.create({
      data: {
        foodType: data.foodType,
        quantity: data.quantity,
        expiryDate: new Date(data.expiryDate),
        address: data.address,
        userId: session.user.id,
      },
    });
    await sendDonationConfirmationEmail(session.user.email, session.user.name || 'Donatur', newDonation);
    await sendDonationNotificationEmail('afzalkhm1203@gmail.com', newDonation, session.user);
    return new NextResponse(JSON.stringify(newDonation), { status: 201 });
  } catch (error) {
    console.error("Gagal membuat donasi:", error);
    return new NextResponse(JSON.stringify({ message: 'Gagal membuat donasi' }), { status: 500 });
  }
}