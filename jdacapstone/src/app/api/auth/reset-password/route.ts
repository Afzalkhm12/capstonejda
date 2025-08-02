import { NextResponse } from 'next/server';
 import prisma from '@/lib/prisma';
 import bcrypt from 'bcryptjs';

 export const runtime = 'nodejs';
 
 export async function POST(request: Request) {
   try {
     const { token, password } = await request.json();

     const resetToken = await prisma.passwordResetToken.findUnique({
       where: { token },
     });

     if (!resetToken || new Date(resetToken.expires) < new Date()) {
       return new NextResponse(
         JSON.stringify({ message: 'Token tidak valid atau sudah kedaluwarsa.' }),
         { status: 400 }
       );
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     await prisma.user.update({
       where: { email: resetToken.email },
       data: { password: hashedPassword },
     });

     await prisma.passwordResetToken.delete({ where: { token } });
    
     return new NextResponse(JSON.stringify({ message: 'Password berhasil diubah.' }), { status: 200 });

   } catch (error) {
     console.error(error);
     return new NextResponse(
       JSON.stringify({ message: 'Terjadi kesalahan pada server.' }),
       { status: 500 }
     );
   }
 }