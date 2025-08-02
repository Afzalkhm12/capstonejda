import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth'; 
export const runtime = 'nodejs';
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const { id } = await params;
    const donationId = parseInt(id, 10);
    
    if (isNaN(donationId)) {
        return new NextResponse(JSON.stringify({ message: 'Invalid donation ID' }), { status: 400 });
    }

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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const { id } = await params;
    const donationId = parseInt(id, 10);

    if (isNaN(donationId)) {
        return new NextResponse(JSON.stringify({ message: 'Invalid donation ID' }), { status: 400 });
    }

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