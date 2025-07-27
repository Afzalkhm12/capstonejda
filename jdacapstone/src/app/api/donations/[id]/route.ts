/// <reference path="../../../../types/next-auth.d.ts" />

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/[...nextauth]/route";

// Fungsi helper untuk memeriksa apakah pengguna berhak mengakses donasi
async function checkAuthorization(donationId: number) {
    const session = await getServerSession(authOptions as any);

    // Dengan referensi di atas, error di baris ini seharusnya hilang di editor Anda.
    if (!session?.user?.id) {
        return { authorized: false, error: new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }) };
    }

    const donation = await prisma.donation.findUnique({
        where: { id: donationId },
    });

    if (!donation) {
        return { authorized: false, error: new NextResponse(JSON.stringify({ message: 'Donation not found' }), { status: 404 }) };
    }

    if (donation.userId !== session.user.id) {
        return { authorized: false, error: new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 }) };
    }

    return { authorized: true, error: null };
}

// Handler untuk mengubah (update) donasi
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
    const donationId = parseInt(params.id, 10);
    const { authorized, error } = await checkAuthorization(donationId);
    if (!authorized || error) return error;

    try {
        const data = await request.json();
        const updatedDonation = await prisma.donation.update({
            where: { id: donationId },
            data: {
                foodType: data.foodType,
                quantity: data.quantity,
                expiryDate: new Date(data.expiryDate),
                address: data.address,
                status: data.status,
            },
        });
        return NextResponse.json(updatedDonation);
    } catch (e) {
        console.error("Gagal memperbarui donasi:", e);
        return new NextResponse(JSON.stringify({ message: 'Gagal memperbarui donasi' }), { status: 500 });
    }
}

// Handler untuk menghapus donasi
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    const donationId = parseInt(params.id, 10);
    const { authorized, error } = await checkAuthorization(donationId);
    if (!authorized || error) return error;

    try {
        await prisma.donation.delete({
            where: { id: donationId },
        });
        return new NextResponse(null, { status: 204 }); // 204 No Content
    } catch (e) {
        console.error("Gagal menghapus donasi:", e);
        return new NextResponse(JSON.stringify({ message: 'Gagal menghapus donasi' }), { status: 500 });
    }
}
