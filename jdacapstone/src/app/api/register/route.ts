import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Nama, email, dan password harus diisi.' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email ini sudah terdaftar.' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ 
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });
    await sendVerificationEmail(email, verificationToken);

    return new NextResponse(JSON.stringify({ message: "Registrasi berhasil, silakan verifikasi email Anda." }), { status: 201 });

  } catch (error) {
    console.error("Kesalahan pada API Registrasi:", error);
    return new NextResponse(JSON.stringify({ message: 'Terjadi kesalahan pada server.' }), { status: 500 });
  }
}