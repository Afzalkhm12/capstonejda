import { NextResponse } from 'next/server';
import { products, Product } from './data';
export async function GET() {
  return NextResponse.json(products);
}
export async function POST(request: Request) {
  const newProductData: Omit<Product, 'id'> = await request.json();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const newProduct: Product = {
    id: newId,
    ...newProductData,
  };
  products.push(newProduct);
  return new NextResponse(JSON.stringify(newProduct), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}