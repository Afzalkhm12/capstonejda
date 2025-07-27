'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar glass-nav">
            <div className="container nav-container">
                <div className="nav-brand">
                    <Link href="/">
                        <h2>🌱 GreenGive</h2>
                    </Link>
                </div>

                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link href="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
                    <li><Link href="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
                    <li><Link href="/donate" className="nav-link" onClick={closeMenu}>Donate Food</Link></li>
                    <li><Link href="/products" className="nav-link" onClick={closeMenu}>Products</Link></li>
                    <li><Link href="/profile" className="nav-link" onClick={closeMenu}>Profile</Link></li>
                    <li><Link href="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>
                </ul>

                {/* --- LOGIKA AUTENTIKASI DITAMBAHKAN DI SINI --- */}
                <div className="nav-actions">
                    {status === 'loading' ? (
                        <div className="w-20 h-10 bg-gray-200/50 rounded-md animate-pulse"></div>
                    ) : status === 'authenticated' ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Image
                                        src={session.user?.image || `https://avatar.vercel.sh/${session.user?.email}.png`}
                                        alt="User Avatar"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/my-donations">My Donations</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild className="login-button">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
                {/* ----------------------------------------------- */}

                <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}