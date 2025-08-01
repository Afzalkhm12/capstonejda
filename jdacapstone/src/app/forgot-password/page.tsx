'use client';

import { useState, FormEvent } from 'react';
import { toast } from "sonner";
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    toast.promise(promise, {
      loading: 'Mengirim email...',
      success: (res) => {
        if (!res.ok) throw new Error('Gagal mengirim email.');
        return 'Jika email terdaftar, link reset akan dikirim.';
      },
      error: 'Terjadi kesalahan.',
    });

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Lupa Password"
      description="Masukkan email Anda untuk menerima link reset password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary glass-btn w-full" disabled={isLoading}>
          <span>{isLoading ? 'Memproses...' : 'Kirim Link Reset'}</span>
          <div className="btn-glow"></div>
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-text-secondary">
          Kembali ke halaman{' '}
          <Link href="/login" className="font-medium text-blue hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}