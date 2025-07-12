'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar glass-nav">
            <div className="container">
                <div className="nav-brand">
                    <Link href="/">
                        <h2>🌱 GreenGive</h2>
                    </Link>
                </div>
                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link href="/" className="nav-link">Home</Link></li>
                    <li><Link href="/about" className="nav-link">About</Link></li>
                    <li><Link href="/donate" className="nav-link">Donate Food</Link></li>
                    <li><Link href="/products" className="nav-link">Products</Link></li>
                    <li><Link href="/profile" className="nav-link">Profile</Link></li>
                    <li><Link href="/contact" className="nav-link">Contact</Link></li>
                </ul>
                <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}
