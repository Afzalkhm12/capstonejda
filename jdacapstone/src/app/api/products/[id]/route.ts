import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Menggunakan Prisma untuk akses database

/**
 * Mengambil satu produk berdasarkan ID.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id, 10) },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Produk tidak ditemukan" }),
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Gagal mengambil produk ${params.id}:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil produk" }),
      { status: 500 }
    );
  }
}

/**
 * Mengubah (update) produk berdasarkan ID.
 * Catatan: Rute ini harus dilindungi agar hanya bisa diakses oleh admin.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id, 10) },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Gagal memperbarui produk ${params.id}:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal memperbarui produk" }),
      { status: 500 }
    );
  }
}

/**
 * Menghapus produk berdasarkan ID.
 * Catatan: Rute ini harus dilindungi agar hanya bisa diakses oleh admin.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id, 10) },
    });
    // Respon 204 No Content adalah standar untuk DELETE yang berhasil
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Gagal menghapus produk ${params.id}:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal menghapus produk" }),
      { status: 500 }
    );
  }
}
