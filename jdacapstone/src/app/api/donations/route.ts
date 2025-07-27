import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
// Pastikan path impor ini benar
import { authOptions } from "@/app/api/[...nextauth]/route";

export async function GET() {
  // getServerSession sekarang akan mengembalikan tipe Session yang sudah kita definisikan
  const session = await getServerSession(authOptions as any);

  // --- PENJELASAN ERROR ---
  // Jika Anda masih melihat error "Property 'user' does not exist" di baris bawah ini,
  // itu karena editor Anda belum memuat ulang definisi tipe dari 'next-auth.d.ts'.
  //
  // SOLUSI:
  // 1. Buka Command Palette di VS Code (Ctrl+Shift+P atau Cmd+Shift+P).
  // 2. Ketik "TypeScript: Restart TS server" dan tekan Enter.
  // 3. Error seharusnya akan hilang setelah beberapa detik.
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
  const session = await getServerSession(authOptions as any);

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validasi data yang masuk
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
    return new NextResponse(JSON.stringify(newDonation), { status: 201 });
  } catch (error) {
    console.error("Gagal membuat donasi:", error);
    return new NextResponse(JSON.stringify({ message: 'Gagal membuat donasi' }), { status: 500 });
  }
}
