'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

type Category = 'All' | 'Apparel' | 'Accessories' | 'Home & Garden';

interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    image: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState<Category>('All');
    const [isLoading, setIsLoading] = useState(true);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({ name: '', price: 0, category: 'Accessories', image: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data: Product[] = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
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

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
        } else {
            setIsEditing(false);
            setCurrentProduct({ name: '', price: 0, category: 'Accessories', image: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveProduct = async (e: FormEvent) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentProduct),
            });
            const savedProduct: Product = await res.json();

            if (isEditing) {
                setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
            } else {
                setProducts([...products, savedProduct]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return <p className="container text-center mt-lg">Loading products...</p>;

    return (
        <div className="container">
            <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)'}}>
                <div>
                    <h1>Sustainable Products</h1>
                    <p>Support our mission with eco-friendly merchandise</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Product</button>
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
                        <Image src={product.image} alt={product.name} width={300} height={200} style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
                        <div className="card-body">
                            <h3>{product.name}</h3>
                            <p className="product-price">${product.price.toString()}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <button className="btn btn-secondary" onClick={() => handleOpenModal(product)}>Edit</button>
                                <button className="btn btn-secondary" style={{backgroundColor: '#ffdddd', color: '#c62828'}} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-backdrop" onClick={handleCloseModal}>
                    <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" id="name" name="name" value={currentProduct.name} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="number" id="price" name="price" value={currentProduct.price} onChange={handleInputChange} className="form-control" required step="0.01" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select id="category" name="category" value={currentProduct.category} onChange={handleInputChange} className="form-control" required>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Home & Garden">Home & Garden</option>
                                </select>
                            </div>
                             <div className="form-group">
                                <label htmlFor="image" className="form-label">Image URL</label>
                                <input type="text" id="image" name="image" value={currentProduct.image} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </div>
    );
}