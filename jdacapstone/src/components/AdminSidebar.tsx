'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, UtensilsCrossed, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Kelola Produk', icon: Package },
  { href: '/admin/donations', label: 'Kelola Donasi', icon: UtensilsCrossed },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:flex flex-col w-64 border-r bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="p-4 border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-primary">🌱 GreenGive</h2>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-primary",
              pathname === item.href && "bg-green-100 dark:bg-green-900/50 text-primary font-bold"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
         <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-primary w-full"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
      </div>
    </aside>
  );
}