import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token tidak ditemukan.' }), { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=InvalidToken`);
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=ExpiredToken`);
    }

    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token: verificationToken.token,
      },
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`);

  } catch (error) {
    console.error("Gagal verifikasi token:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=VerificationFailed`);
  }
}