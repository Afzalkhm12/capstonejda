'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

type Category = 'All' | 'Apparel' | 'Accessories' | 'Home & Garden';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState<Category>('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data: Product[] = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Gagal memuat produk:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === filter));
        }
    }, [filter, products]);

    if (isLoading) return <p className="container text-center mt-lg">Memuat produk...</p>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Produk Berkelanjutan</h1>
                <p>Dukung misi kami dengan merchandise ramah lingkungan</p>
            </div>

            <div className="products-filter">
                <div className="filter-buttons">
                    {(['All', 'Apparel', 'Accessories', 'Home & Garden'] as const).map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${filter === category ? 'active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="products-grid" id="products-grid">
                {filteredProducts.map(product => (
                    <Link href={`/products/${product.id}`} key={product.id} className="product-card glass-card no-underline">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={300}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/e8f5e8/1a3b1a?text=Gambar+Rusak'; }}
                        />
                        <div className="card-body">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="product-price">Rp{product.price.toLocaleString('id-ID')}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}