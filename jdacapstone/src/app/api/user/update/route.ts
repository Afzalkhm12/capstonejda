import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';

const { auth } = NextAuth(authConfig);

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Nama tidak boleh kosong.' }), { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.auth.user.id },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Gagal memperbarui profil:", error);
    return new NextResponse(JSON.stringify({ message: 'Terjadi kesalahan pada server.' }), { status: 500 });
  }
});