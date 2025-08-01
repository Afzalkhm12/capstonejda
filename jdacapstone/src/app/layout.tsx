import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './provider';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"; // <-- 1. Import ThemeProvider

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider // <-- 2. Bungkus semua dengan ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster richColors position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
