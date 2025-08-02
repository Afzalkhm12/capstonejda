import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
type DonationWithUser = {
  id: number;
  userId: string; 
  foodType: string;
  quantity: string; 
  createdAt: Date;
  user: {
    name: string | null;
  };
};

type User = {
    name: string | null;
    createdAt: Date;
}

type Product = {
    createdAt: Date;
}

export async function GET() {
  try {
    const totalDonations = await prisma.donation.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    
    const productPriceSum = await prisma.product.aggregate({
      _sum: {
        price: true,
      },
    });
    const totalRevenue = productPriceSum._sum.price || 0;
    const recentDonations: DonationWithUser[] = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });

    const recentUsers: User[] = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    const formattedDonations = recentDonations.map((d) => ({
      type: 'donation',
      user: d.user.name || 'Pengguna',
      item: `${d.foodType} (${d.quantity})`,
      time: d.createdAt.toISOString(),
    }));

    const formattedUsers = recentUsers.map((u) => ({
      type: 'user',
      user: u.name || 'Pengguna baru',
      item: 'mendaftar',
      time: u.createdAt.toISOString(), 
    }));
    
    const recentActivities = [...formattedDonations, ...formattedUsers]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donationsForChart: { createdAt: Date }[] = await prisma.donation.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const productsForChart: Product[] = await prisma.product.findMany({
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

    donationsForChart.forEach((d) => {
        const month = monthNames[new Date(d.createdAt).getMonth()];
        const monthData = chartData.find(m => m.month === month);
        if (monthData) monthData.donations++;
    });

    productsForChart.forEach((p) => {
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