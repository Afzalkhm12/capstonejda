import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductOrderClient from './ProductOrderClient'; 
interface ProductDetailPageProps {
  params: Promise<{ id: string }>; 
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);

    if (isNaN(id)) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }
    return <ProductOrderClient product={product} />;
}