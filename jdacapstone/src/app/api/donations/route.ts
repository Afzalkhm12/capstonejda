import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth'; // <-- Perbaikan: Impor authConfig
import { sendDonationConfirmationEmail, sendDonationNotificationEmail } from '@/lib/mail';

// Gunakan auth helper dari NextAuth v5
const { auth } = NextAuth(authConfig);

// Gunakan 'auth' untuk melindungi route
export const GET = auth(async (req) => {
  // Session tersedia di req.auth
  if (!req.auth?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: req.auth.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Gagal mengambil donasi:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil donasi" }), { status: 500 });
  }
});

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id || !req.auth?.user?.email) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.foodType || !data.quantity || !data.expiryDate || !data.address) {
        return new NextResponse(JSON.stringify({ message: 'Data yang dibutuhkan tidak lengkap' }), { status: 400 });
    }

    const newDonation = await prisma.donation.create({
      data: {
        foodType: data.foodType,
        quantity: data.quantity,
        expiryDate: new Date(data.expiryDate),
        address: data.address,
        userId: req.auth.user.id,
      },
    });

    await sendDonationConfirmationEmail(req.auth.user.email, req.auth.user.name || 'Donatur', newDonation);
    await sendDonationNotificationEmail('afzalkhm1203@gmail.com', newDonation, req.auth.user);

    return new NextResponse(JSON.stringify(newDonation), { status: 201 });
  } catch (error) {
    console.error("Gagal membuat donasi:", error);
    return new NextResponse(JSON.stringify({ message: 'Gagal membuat donasi' }), { status: 500 });
  }
});