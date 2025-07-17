import { NextResponse } from 'next/server';
import { products, Product } from '../data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find(p => p.id === parseInt(params.id, 10));
  if (product) {
    return NextResponse.json(product);
  }
  return new NextResponse(JSON.stringify({ message: "Product not found" }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productIndex = products.findIndex(p => p.id === parseInt(params.id, 10));

  if (productIndex === -1) {
    return new NextResponse(JSON.stringify({ message: "Product not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const updatedProductData: Partial<Product> = await request.json();
  const updatedProduct = { ...products[productIndex], ...updatedProductData };
  products[productIndex] = updatedProduct;

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productIndex = products.findIndex(p => p.id === parseInt(params.id, 10));

  if (productIndex === -1) {
    return new NextResponse(JSON.stringify({ message: "Product not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  products.splice(productIndex, 1);
  return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}