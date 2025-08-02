// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, Users, UtensilsCrossed, Activity, Loader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Definisikan tipe data untuk statistik
interface DashboardStats {
    totalRevenue: number;
    totalDonations: number;
    totalProducts: number;
    totalUsers: number;
    recentActivities: {
        type: string;
        user: string | null;
        item: string;
        time: string;
    }[];
    chartData: {
        month: string;
        donations: number;
        products: number;
    }[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setIsLoading(true);
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Gagal mengambil statistik dashboard", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-lg text-muted-foreground">Memuat Data Dashboard...</p>
                </div>
            </div>
        );
    }
    
    if (!stats) {
        return <div className="text-center py-10 text-red-500">Gagal memuat data. Silakan coba lagi nanti.</div>
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Selamat datang kembali, Admin!</p>
            </header>
            
            <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan Produk</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rp{stats.totalRevenue.toLocaleString('id-ID')}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimasi dari total harga produk</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
                        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalDonations}</div>
                        <p className="text-xs text-muted-foreground">Jumlah donasi yang tercatat</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Produk</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">Produk yang tersedia di toko</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Pengguna yang terdaftar</p>
                    </CardContent>
                </Card>
            </main>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                     <CardHeader>
                        <CardTitle>Analitik Bulanan</CardTitle>
                        <CardDescription>Donasi dan produk baru dalam 6 bulan terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700"/>
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <Tooltip wrapperClassName="!bg-popover !border-border !rounded-lg !shadow-lg" cursor={{ fill: 'hsl(var(--muted))' }}/>
                                <Legend />
                                <Bar dataKey="donations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Donasi" />
                                <Bar dataKey="products" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Produk Baru" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5"/>
                            <span>Aktivitas Terbaru</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.recentActivities.length > 0 ? stats.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
                                       {activity.type === 'donation' ? '🍽️' : '👤'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            <span className="font-bold">{activity.user || "Pengguna"}</span> {activity.type === 'donation' ? `mendonasi ${activity.item}` : 'telah mendaftar'}.
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                           {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: id })}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas terbaru.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}