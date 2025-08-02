import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { User } from '@prisma/client'; // <-- 1. Impor tipe dari Prisma

// Definisikan tipe gabungan untuk hasil query donasi dengan data user
type DonationWithUser = {
  id: number;
  userId: number;
  foodType: string;
  quantity: number;
  createdAt: Date;
  user: {
    name: string | null;
  };
};

export async function GET() {
  try {
    // 1. Ambil Statistik Utama
    const totalDonations = await prisma.donation.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    
    const productPriceSum = await prisma.product.aggregate({
      _sum: {
        price: true,
      },
    });
    const totalRevenue = productPriceSum._sum.price || 0;

    // 2. Ambil Aktivitas Terbaru
    const recentDonations: DonationWithUser[] = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Format aktivitas agar seragam
    const formattedDonations = recentDonations.map((d: DonationWithUser) => ({ // <-- 2. Tambahkan tipe di sini
      type: 'donation',
      user: d.user.name || 'Pengguna',
      item: `${d.foodType} (${d.quantity})`,
      time: d.createdAt.toISOString(),
    }));

    const formattedUsers = recentUsers.map((u: { name: string | null; createdAt: Date }) => ({ // <-- 3. Tambahkan tipe di sini
      type: 'user',
      user: u.name || 'Pengguna baru',
      item: 'mendaftar',
      time: u.createdAt.toISOString(), 
    }));
    
    const recentActivities = [...formattedDonations, ...formattedUsers]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);

    // 3. Siapkan Data untuk Chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donationsForChart = await prisma.donation.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const productsForChart = await prisma.product.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const chartData = Array(6).fill(0).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            month: monthNames[d.getMonth()],
            donations: 0,
            products: 0,
        };
    }).reverse();

    donationsForChart.forEach((d: { createdAt: Date }) => { // <-- 4. Tambahkan tipe di sini
        const month = monthNames[new Date(d.createdAt).getMonth()];
        const monthData = chartData.find(m => m.month === month);
        if (monthData) monthData.donations++;
    });

    productsForChart.forEach((p: { createdAt: Date }) => { // <-- 5. Tambahkan tipe di sini
        const month = monthNames[new Date(p.createdAt).getMonth()];
        const monthData = chartData.find(m => m.month === month);
        if (monthData) monthData.products++;
    });

    return NextResponse.json({
      totalRevenue,
      totalDonations,
      totalProducts,
      totalUsers,
      recentActivities,
      chartData,
    });

  } catch (error) {
    console.error("Gagal mengambil statistik admin:", error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil data statistik" }),
      { status: 500 }
    );
  }
}