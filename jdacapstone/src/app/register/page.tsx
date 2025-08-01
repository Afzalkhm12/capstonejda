'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registrasi berhasil!", {
          description: "Email verifikasi telah dikirim. Silakan cek kotak masuk Anda."
        });
        router.push('/login');
      } else {
        toast.error("Registrasi gagal.", {
          description: data.message || "Silakan coba lagi.",
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.", {
        description: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun"
      description="Bergabunglah dengan GreenGive dan buat perbedaan hari ini."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nama Lengkap</label>
          <input
            id="name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            disabled={isLoading}
          />
        </div>
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
          <span>{isLoading ? 'Memproses...' : 'Buat Akun'}</span>
          <div className="btn-glow"></div>
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-text-secondary">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
