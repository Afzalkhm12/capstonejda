'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            console.error("Terjadi kesalahan:", error);
            toast.error("Terjadi kesalahan saat memuat produk.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-lg text-muted-foreground">Memuat Produk...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-gradient">Produk Kami</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Dukung misi kami dengan membeli merchandise ramah lingkungan. Setiap pembelian membantu upaya kami mengurangi limbah makanan.
                </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                    products.map((product) => {
                        const imageUrl = isValidImageUrl(product.image) ? product.image : 'https://placehold.co/400x300/e8f5e8/1a3b1a?text=Gambar+Tidak+Tersedia';
                        return (
                            <Link href={`/products/${product.id}`} key={product.id}>
                                {/* PERBAIKAN: Menambahkan class "glass-card" */}
                                <Card className="glass-card overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer h-full flex flex-col">
                                    <CardHeader className="p-0">
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            width={400}
                                            height={300}
                                            className="w-full h-60 object-cover"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                                        <CardTitle className="text-xl font-semibold mb-3">{product.name}</CardTitle>
                                        <div className="mt-auto">
                                            <p className="text-lg font-bold text-primary">
                                                Rp{product.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">Belum ada produk yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    );
}