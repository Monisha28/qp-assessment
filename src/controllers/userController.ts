import { Request, Response } from 'express';
import Order from '../models/Order';
import Inventory from '../models/Inventory';
import { executeQuery } from '../services/dbService';

export const viewAvailableItems = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT name, price, quantityAvailable, category 
            FROM inventory 
            WHERE quantityAvailable > 0
        `;

        const items: Inventory[] = await executeQuery<Inventory>(query);
    
        return res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const orderGroceryItems = async (req: Request, res: Response) => {
    try {
        const { userId, products, totalPrice }: Order = req.body;

        const orderQuery = 'INSERT INTO orders (userId, totalPrice) VALUES (?, ?)';
        const orderResult: {[k: string]: any} = await executeQuery(orderQuery, [userId, totalPrice]);
        const orderId = orderResult.insertId;

        const orderItemsQuery = `
            INSERT INTO order_items 
            (orderId, productId, orderedQuantity, unitSellingPrice) 
            VALUES (?)
        `;
        const orderItemsValues = products.map(product => 
            [orderId, product.productId, product.orderedQuantity, product.unitSellingPrice]
        );
        await executeQuery(orderItemsQuery, [orderItemsValues]);

        return res.status(200).json({ message: 'Grocery items booked successfully', orderId });
    } catch (error) {
        console.error('Error booking grocery items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
