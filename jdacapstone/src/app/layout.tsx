// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './provider';
import { Toaster } from "@/components/ui/sonner"; // Ganti import ini
import './globals.css'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenGive - Donate Food, Save Planet',
  description: 'Join our mission to reduce food waste and help communities in need. Every donation makes a difference.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster richColors /> {/* Gunakan Toaster dari Sonner */}
        </Providers>
      </body>
    </html>
  );
}