'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        toast.success("Login berhasil!");
        window.location.href = callbackUrl;
      } else {
        toast.error("Login Gagal", {
          description: result?.error || "Kredensial tidak valid.",
        });
      }
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      description="Selamat datang kembali! Masuk untuk melanjutkan."
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
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
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
        <button type="submit" className="btn btn-primary glass-btn w-full" disabled={isLoading}>
          <span>{isLoading ? 'Memproses...' : 'Login'}</span>
          <div className="btn-glow"></div>
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-text-secondary">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
        <p className="text-text-secondary mt-2">
          Lupa Password?{' '}
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Reset
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
