import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Produk tidak ditemukan" }),
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Gagal mengambil produk:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil produk" }),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 400 }
      );
    }

    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Gagal memperbarui produk:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal memperbarui produk" }),
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Gagal menghapus produk:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal menghapus produk" }),
      { status: 500 }
    );
  }
}