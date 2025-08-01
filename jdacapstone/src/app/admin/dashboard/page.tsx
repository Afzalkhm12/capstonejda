'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, UtensilsCrossed } from "lucide-react";

const stats = {
    totalRevenue: 12500000,
    totalDonations: 78,
    totalProducts: 15,
    totalUsers: 120
};

export default function AdminDashboardPage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pendapatan
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rp{stats.totalRevenue.toLocaleString('id-ID')}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +10.2% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Donasi
                        </CardTitle>
                        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalDonations}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +5 dari minggu lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jumlah Produk
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalProducts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +2 produk baru bulan ini
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pengguna Terdaftar
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +15 pengguna baru bulan ini
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                 {/* Di sini Anda bisa menambahkan komponen lain seperti tabel donasi terbaru, dll. */}
                 <h2 className="text-2xl font-bold mb-4">Aktivitas Terbaru</h2>
                 <Card>
                    <CardContent className="p-6">
                        <p>Tabel atau daftar aktivitas terbaru akan ditampilkan di sini.</p>
                    </CardContent>
                 </Card>
            </div>
        </div>
    )
}