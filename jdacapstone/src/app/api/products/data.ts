export interface Product {
    id: number;
    name: string;
    price: number;
    category: 'Apparel' | 'Accessories' | 'Home & Garden';
    image: string;
}
export let products: Product[] = [
    { id: 1, name: "Organic Cotton Tote Bag", price: 15.99, category: "Accessories", image: "https://images.unsplash.com/photo-1594788404458-545a3a58a114?w=300&h=300&fit=crop" },
    { id: 2, name: "GreenGive T-Shirt", price: 24.99, category: "Apparel", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" },
    { id: 3, name: "Reusable Beeswax Wraps", price: 18.50, category: "Home & Garden", image: "https://images.unsplash.com/photo-1621975239269-57c4c4c6f3c4?w=300&h=300&fit=crop" },
    { id: 4, name: "Bamboo Utensil Set", price: 12.00, category: "Accessories", image: "https://images.unsplash.com/photo-1618492198822-f71243ee5a34?w=300&h=300&fit=crop" },
    { id: 5, name: "Compost Bin", price: 45.00, category: "Home & Garden", image: "https://images.unsplash.com/photo-1604135334411-9e4a8581689e?w=300&h=300&fit=crop" },
    { id: 6, name: "Recycled Material Hoodie", price: 55.00, category: "Apparel", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop" },
];