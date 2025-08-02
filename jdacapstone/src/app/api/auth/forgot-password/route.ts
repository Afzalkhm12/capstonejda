import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mail';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const oneHour = 60 * 60 * 1000;
      const expires = new Date(Date.now() + oneHour);

      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      });

      await sendPasswordResetEmail(email, token);
    }
    
    return new NextResponse(
      JSON.stringify({ message: 'Jika email terdaftar, link reset akan dikirim.' }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Terjadi kesalahan pada server.' }),
      { status: 500 }
    );
  }
}