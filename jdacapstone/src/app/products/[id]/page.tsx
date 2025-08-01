'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (!res.ok) {
                    throw new Error('Produk tidak ditemukan');
                }
                const data: Product = await res.json();
                setProduct(data);
            } catch (error) {
                toast.error("Gagal memuat detail produk.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [params.id]);

    if (isLoading) return <p className="container text-center py-12">Memuat produk...</p>;
    if (!product) return <p className="container text-center py-12">Produk tidak ditemukan.</p>;

    return (
        <div className="container py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="glass-card p-4">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/e8f5e8/1a3b1a?text=Gambar+Rusak'; }}
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4 text-gradient">{product.name}</h1>
                    <p className="text-2xl font-semibold text-primary mb-4">Rp{product.price.toLocaleString('id-ID')}</p>
                    <p className="text-muted-foreground mb-6">Kategori: {product.category}</p>
                    <div className="prose">
                        <p>Dukung misi kami dengan membeli merchandise ramah lingkungan ini. Dibuat dari bahan-bahan berkualitas dan berkelanjutan, setiap pembelian membantu kami dalam upaya mengurangi limbah makanan dan memberi makan mereka yang membutuhkan.</p>
                        <ul>
                            <li>Bahan ramah lingkungan</li>
                            <li>Desain modern dan stylish</li>
                            <li>Keuntungan disalurkan untuk program donasi makanan</li>
                        </ul>
                    </div>
                    <Button size="lg" className="mt-8 w-full md:w-auto btn-primary glass-btn">
                        <span>Tambah ke Keranjang</span>
                        <div className="btn-glow"></div>
                    </Button>
                </div>
            </div>
        </div>
    );
}