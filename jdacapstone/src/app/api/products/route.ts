import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Menggunakan Prisma untuk akses database

/**
 * Mengambil semua data produk dari database.
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil produk" }),
      { status: 500 }
    );
  }
}

/**
 * Membuat produk baru di database.
 * Catatan: Rute ini harus dilindungi agar hanya bisa diakses oleh admin.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validasi data input
    if (!data.name || !data.price || !data.category || !data.image) {
      return new NextResponse(
        JSON.stringify({ message: 'Data yang dibutuhkan tidak lengkap' }),
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
      },
    });
    return new NextResponse(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error("Gagal membuat produk:", error);
    return new NextResponse(
      JSON.stringify({ message: 'Gagal membuat produk' }),
      { status: 500 }
    );
  }
}
