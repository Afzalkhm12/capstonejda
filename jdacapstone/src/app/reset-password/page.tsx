'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from "sonner";
import AuthLayout from '@/components/AuthLayout';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error("Token tidak valid atau hilang.");
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok.");
      return;
    }
    setIsLoading(true);

    const promise = fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    toast.promise(promise, {
      loading: 'Menyimpan password baru...',
      success: (res) => {
        if (!res.ok) throw new Error('Gagal mereset password.');
        router.push('/login');
        return 'Password berhasil diubah! Silakan login.';
      },
      error: 'Token tidak valid atau sudah kedaluwarsa.',
    });

    setIsLoading(false);
  };

  if (!token) {
    return <div className="text-center text-text-secondary">Token tidak ditemukan...</div>;
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Masukkan password baru Anda."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password Baru</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password Baru</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary glass-btn w-full" disabled={isLoading}>
          <span>{isLoading ? 'Memproses...' : 'Reset Password'}</span>
          <div className="btn-glow"></div>
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}