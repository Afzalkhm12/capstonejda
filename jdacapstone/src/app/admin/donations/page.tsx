'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface Donation {
  id: number;
  foodType: string;
  quantity: string;
  address: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/donations');
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch (err) { 
      console.error('Gagal memuat data donasi:', err);
      toast.error('Gagal memuat data donasi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const promise = fetch(`/api/admin/donations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (!res.ok) throw new Error('Gagal memperbarui status.');
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Memperbarui status...',
      success: () => {
        fetchDonations(); 
        return 'Status berhasil diperbarui!';
      },
      error: (err) => err.message,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Kelola Donasi</h1>
        <p className="text-muted-foreground">Lihat dan kelola semua donasi yang masuk.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donatur</TableHead>
                <TableHead>Detail Donasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      <div>{donation.user.name}</div>
                      <div className="text-xs text-muted-foreground">{donation.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{donation.foodType} ({donation.quantity})</div>
                      <div className="text-xs text-muted-foreground">{donation.address}</div>
                    </TableCell>
                    <TableCell>
                       <Badge variant={donation.status === 'Pending' ? 'destructive' : 'default'}>
                         {donation.status}
                       </Badge>
                    </TableCell>
                    <TableCell>{new Date(donation.createdAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(donation.id, 'Selesai')}>
                            Tandai Selesai
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(donation.id, 'Pending')}>
                            Tandai Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Belum ada donasi yang masuk.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}