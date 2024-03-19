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
        const { products, totalPrice }: Order = req.body;

        const productIds = products.map(product => product.productId);

        const inventoryQuery = `
            SELECT JSON_OBJECTAGG(id, quantityAvailable) as itemQuantityAvailability
            FROM inventory 
            WHERE id IN (?)
        `;
        let [{ itemQuantityAvailability }]: any = await executeQuery(inventoryQuery, [productIds]);
        itemQuantityAvailability = JSON.parse(itemQuantityAvailability)

        for (let {productId, orderedQuantity} of products) {
            itemQuantityAvailability[productId] = itemQuantityAvailability[productId] - orderedQuantity;
            if (itemQuantityAvailability[productId] < 0) {
                return res.status(400).json({ message: 'Order cannot be placed, Grocery item goes Out Of Stock'});
            }
        }

        await executeQuery("START TRANSACTION");

        const orderQuery = 'INSERT INTO orders (userId, totalPrice) VALUES (?, ?)';
        // @ts-ignore
        const orderResult: {[k: string]: any} = await executeQuery(orderQuery, [req.user.userId, totalPrice]);
        const orderId = orderResult.insertId;

        const orderItemsQuery = `
            INSERT INTO order_items 
            (orderId, productId, orderedQuantity, unitSellingPrice) 
            VALUES ?
        `;
        const orderItemsValues = products.map(product => 
            [orderId, product.productId, product.orderedQuantity, product.unitSellingPrice]
        );
        await executeQuery(orderItemsQuery, [orderItemsValues]);

        const query = `
            INSERT IGNORE INTO inventory (id, quantityAvailable) 
            VALUES ? AS i 
            ON DUPLICATE KEY UPDATE 
            quantityAvailable = i.quantityAvailable
        `;
        await executeQuery(query, [Object.entries(itemQuantityAvailability)]);

        await executeQuery("COMMIT");

        return res.status(200).json({ message: 'Grocery items booked successfully', orderId });
    } catch (error) {
        console.error('Error booking grocery items:', error);
        await executeQuery("ROLLBACK");
        return res.status(500).json({ message: 'Internal server error' });
    }
};  
