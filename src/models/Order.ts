export default interface Order {
    id: number;
    userId: number;
    products: Array<{ productId: number; orderedQuantity: number; unitSellingPrice: number }>;
    totalPrice: number;
}