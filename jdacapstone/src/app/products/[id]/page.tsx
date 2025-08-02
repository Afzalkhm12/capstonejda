import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductOrderClient from './ProductOrderClient';



export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
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