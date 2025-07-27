import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validasi input dasar
    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Nama, email, dan password harus diisi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Cek apakah pengguna sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Kirim respons JSON yang benar jika pengguna sudah ada
      return new NextResponse(
        JSON.stringify({ message: 'Email ini sudah terdaftar.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } } // 409 Conflict
      );
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Hapus password dari objek yang dikembalikan demi keamanan
    const { password: _, ...userWithoutPassword } = user;

    return new NextResponse(JSON.stringify(userWithoutPassword), { status: 201 });

  } catch (error) {
    console.error("Kesalahan pada API Registrasi:", error);
    // Kirim respons error umum jika terjadi kesalahan tak terduga
    return new NextResponse(
      JSON.stringify({ message: 'Terjadi kesalahan pada server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
