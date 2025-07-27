'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                toast.error("Gagal memuat produk.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat memuat produk.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenDialog = (product?: Product) => {
        setIsEditing(!!product);
        setCurrentProduct(product || { name: '', price: 0, category: 'Accessories', image: '' });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
        const method = isEditing ? 'PUT' : 'POST';

        const promise = fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentProduct),
        });

        toast.promise(promise, {
            loading: 'Menyimpan produk...',
            success: () => {
                fetchProducts();
                setIsDialogOpen(false);
                return `Produk berhasil ${isEditing ? 'diperbarui' : 'dibuat'}!`;
            },
            error: (err) => `Gagal menyimpan produk: ${err.message}`,
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            const promise = fetch(`/api/products/${id}`, { method: 'DELETE' });
            toast.promise(promise, {
                loading: 'Menghapus produk...',
                success: () => {
                    fetchProducts();
                    return 'Produk berhasil dihapus!';
                },
                error: (err) => `Gagal menghapus produk: ${err.message}`,
            });
        }
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Produk</h1>
                <Button onClick={() => handleOpenDialog()}>Tambah Produk Baru</Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4} className="text-center h-24">Memuat...</TableCell></TableRow>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>Rp{product.price.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)}>Ubah</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Hapus</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="text-center h-24">Belum ada produk.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Ubah Produk' : 'Tambah Produk Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama</Label>
                            <Input id="name" name="name" value={currentProduct.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Harga</Label>
                            <Input id="price" name="price" type="number" value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Kategori</Label>
                            <select id="category" name="category" value={currentProduct.category || 'Accessories'} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="Apparel">Apparel</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Home & Garden">Home & Garden</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">URL Gambar</Label>
                            <Input id="image" name="image" value={currentProduct.image || ''} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} className="col-span-3" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
