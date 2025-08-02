'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Tipe data untuk produk dan form
interface Product {
 id: number;
 name: string;
 price: number;
 category: string;
 image: string | null;
}

interface FormData {
 name: string;
 phone: string;
 address: string;
}

// Fungsi untuk memeriksa URL gambar
const isValidImageUrl = (url: string | null | undefined): url is string => {
 return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));
};

export default function ProductOrderClient({ product }: { product: Product }) {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [formData, setFormData] = useState<FormData>({
 name: '',
 phone: '',
 address: '',
 });

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleOrder = (e: React.FormEvent) => {
 e.preventDefault();

 if (!formData.name || !formData.phone || !formData.address) {
 toast.error("Harap isi semua kolom terlebih dahulu.");
 return;
 }

 const myWhatsAppNumber = "6281234567890"; // GANTI DENGAN NOMOR WA ANDA

 const message = `Halo GreenGive, saya ingin memesan produk:\n\n*Produk:* ${product.name}\n*Harga:* Rp${product.price.toLocaleString('id-ID')}\n\nBerikut data saya:\n*Nama:* ${formData.name}\n*No. WhatsApp:* ${formData.phone}\n*Alamat Pengiriman:* ${formData.address}\n\nMohon info selanjutnya untuk pembayaran. Terima kasih!`;

 const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodeURIComponent(message)}`;

 window.open(whatsappUrl, '_blank');
 setIsModalOpen(false); // Tutup modal setelah diarahkan
 };

 const imageUrl = isValidImageUrl(product.image)
 ? product.image
 : 'https://placehold.co/600x600/e8f5e8/1a3b1a?text=Gambar+Tidak+Tersedia';

 return (
 <div className="container py-12">
 <div className="grid md:grid-cols-2 gap-12 items-start">
 <div className="glass-card p-4">
 <Image
 src={imageUrl}
 alt={product.name}
 width={600}
 height={600}
 className="w-full h-auto object-cover rounded-lg"
 />
 </div>
 <div>
 <h1 className="text-4xl font-bold mb-4 text-gradient">{product.name}</h1>
 <p className="text-2xl font-semibold text-primary mb-4">Rp{product.price.toLocaleString('id-ID')}</p>
 <p className="text-muted-foreground mb-6">Kategori: {product.category}</p>
 <div className="prose mb-8">
 <p>Dukung misi kami dengan membeli merchandise ramah lingkungan ini. Setiap pembelian membantu upaya kami mengurangi limbah makanan.</p>
 </div>

 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
 <DialogTrigger asChild>
 <Button size="lg" className="w-full md:w-auto btn-primary glass-btn">
 <span>Pesan Sekarang</span>
 <div className="btn-glow"></div>
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-[425px] glass-card"> {/* Tambahkan class glass-card di sini */}
 <DialogHeader>
 <DialogTitle>Formulir Pemesanan</DialogTitle>
 </DialogHeader>
 <form onSubmit={handleOrder} className="grid gap-4 py-4">
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="name" className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">Nama</Label>
 <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="phone" className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">No. WhatsApp</Label>
 <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" placeholder="Contoh: 08123456..." required />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="address" className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</Label>
 <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} className="col-span-3 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" rows={3} required />
 </div>
 <DialogFooter>
 <Button type="submit" className="w-full btn-primary glass-btn">
 <span>Order via WhatsApp</span>
 <div className="btn-glow"></div>
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>
 </div>
 </div>
 </div>
 );
}