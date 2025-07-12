'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Category = 'Apparel' | 'Accessories' | 'Home & Garden';

interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    image: string;
}

const allProducts: Product[] = [
    { id: 1, name: "Organic Cotton Tote Bag", price: 15.99, category: "Accessories", image: "https://images.unsplash.com/photo-1594788404458-545a3a58a114?w=300&h=300&fit=crop" },
    { id: 2, name: "GreenGive T-Shirt", price: 24.99, category: "Apparel", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" },
    { id: 3, name: "Reusable Beeswax Wraps", price: 18.50, category: "Home & Garden", image: "https://images.unsplash.com/photo-1621975239269-57c4c4c6f3c4?w=300&h=300&fit=crop" },
    { id: 4, name: "Bamboo Utensil Set", price: 12.00, category: "Accessories", image: "https://images.unsplash.com/photo-1618492198822-f71243ee5a34?w=300&h=300&fit=crop" },
    { id: 5, name: "Compost Bin", price: 45.00, category: "Home & Garden", image: "https://images.unsplash.com/photo-1604135334411-9e4a8581689e?w=300&h=300&fit=crop" },
    { id: 6, name: "Recycled Material Hoodie", price: 55.00, category: "Apparel", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop" },
];

export default function ProductsPage() {
    const [filter, setFilter] = useState<Category | 'All'>('All');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredProducts(allProducts);
        } else {
            setFilteredProducts(allProducts.filter(p => p.category === filter));
        }
    }, [filter]);

    return (
        <div className="container">
            <div className="page-header">
                <h1>Sustainable Products</h1>
                <p>Support our mission with eco-friendly merchandise</p>
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
                    <div key={product.id} className="product-card glass-card">
                        <Link href={`/products/${product.id}`}>
                            <Image src={product.image} alt={product.name} width={300} height={200} style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
                            <div className="card-body">
                                <h3>{product.name}</h3>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                                <button className="btn btn-secondary">View Details</button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
