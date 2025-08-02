import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import NextAuth from 'next-auth';
import { authConfig } from "@/lib/auth";
import { NextRequest } from 'next/server';

// Inisialisasi auth helper
const { auth } = NextAuth(authConfig);

// --- Handler untuk method PUT ---
async function handlePut(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth(); // Ambil sesi di dalam handler

    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const donationId = parseInt(params.id, 10);
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });

    if (!donation) {
        return new NextResponse(JSON.stringify({ message: 'Donation not found' }), { status: 404 });
    }
    if (donation.userId !== session.user.id) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    try {
        const data = await req.json();
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

// --- Handler untuk method DELETE ---
async function handleDelete(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth(); // Ambil sesi di dalam handler

    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const donationId = parseInt(params.id, 10);
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });

    if (!donation) {
        return new NextResponse(JSON.stringify({ message: 'Donation not found' }), { status: 404 });
    }
    if (donation.userId !== session.user.id) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    try {
        await prisma.donation.delete({ where: { id: donationId } });
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        console.error("Gagal menghapus donasi:", e);
        return new NextResponse(JSON.stringify({ message: 'Gagal menghapus donasi' }), { status: 500 });
    }
}

// Ekspor handler yang sudah diberi tipe yang benar
export { handlePut as PUT, handleDelete as DELETE };