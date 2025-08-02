'use client';

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DonationFormData {
    foodType: string;
    quantity: string;
    expiryDate: string;
    address: string;
}

export default function DonatePage() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<DonationFormData>({
        foodType: '',
        quantity: '',
        expiryDate: '',
        address: '',
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const promise = fetch('/api/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        toast.promise(promise, {
            loading: 'Mengirim donasi Anda...',
            success: (res) => {
                if (!res.ok) throw new Error('Gagal mengirim donasi.');
                setFormData({ foodType: '', quantity: '', expiryDate: '', address: '' });
                return 'Donasi berhasil dikirim! Terima kasih.';
            },
            error: 'Gagal mengirim donasi. Silakan coba lagi.',
            finally: () => setIsLoading(false),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (status === 'loading') {
        return <div className="container text-center py-12">Memuat...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="container text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Akses Ditolak</h2>
                <p className="mb-6">Anda harus login terlebih dahulu untuk dapat melakukan donasi.</p>
                <button onClick={() => router.push('/login')} className="btn btn-primary glass-btn">
                    Login Sekarang
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Donate Food</h1>
                <p>Bantu kami mengurangi limbah makanan dan memberi makan masyarakat</p>
            </div>
            <div className="donate-content">
                <div className="form-container glass-card">
                    <h2>Formulir Donasi Makanan</h2>
                    <form id="donation-form" className="donation-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="foodType" className="form-label">Jenis Makanan</label>
                            <select id="foodType" name="foodType" value={formData.foodType} className="form-control" required onChange={handleChange} disabled={isLoading}>
                                <option value="">Pilih jenis makanan</option>
                                <option value="Sayur & Buah">Sayur & Buah</option>
                                <option value="Makanan Siap Saji">Makanan Siap Saji</option>
                                <option value="Produk Kemasan">Produk Kemasan</option>
                                <option value="Susu & Olahannya">Susu & Olahannya</option>
                                <option value="Roti & Kue">Roti & Kue</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity" className="form-label">Kuantitas (misal: kg, porsi, kotak)</label>
                            <input type="text" id="quantity" name="quantity" value={formData.quantity} className="form-control" placeholder="Contoh: 10 kg" required onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiryDate" className="form-label">Tanggal Kedaluwarsa</label>
                            <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} className="form-control" required onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Alamat Lengkap Penjemputan</label>
                            <textarea id="address" name="address" value={formData.address} className="form-control" rows={3} required onChange={handleChange} disabled={isLoading}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary glass-btn w-full" disabled={isLoading}>
                            <span>{isLoading ? 'Memproses...' : 'Kirim Donasi'}</span>
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>
                <div className="donation-info">
                    <div className="info-card glass-card">
                        <h3>Panduan Keamanan Pangan</h3>
                        <ul>
                            <li>Makanan harus dalam tanggal kedaluwarsa</li>
                            <li>Makanan siap saji harus disimpan dengan benar</li>
                            <li>Produk kemasan harus belum dibuka</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}