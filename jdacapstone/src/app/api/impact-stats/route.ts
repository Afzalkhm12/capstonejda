import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalDonations = await prisma.donation.count();
    
    const mealsProvided = totalDonations * 15;
    const co2Saved = totalDonations * 2.5; 

    return NextResponse.json({
      totalDonations,
      mealsProvided,
      co2Saved,
    });
  } catch (error) {
    console.error("Gagal mengambil statistik dampak:", error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil data statistik" }),
      { status: 500 }
    );
  }
}