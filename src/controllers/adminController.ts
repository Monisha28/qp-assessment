import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import { executeQuery } from '../services/dbService';

export const addItems = async (req: Request, res: Response) => {
    try {
        const items: Inventory[] = req.body;
    
        const values = items.map(item => [item.name, item.price, item.quantityAvailable, item.category]);
    
        const query = 'INSERT INTO inventory (name, price, quantityAvailable, category) VALUES ?';
    
        await executeQuery(query, [values]);
    
        return res.status(201).json({ message: 'Items added successfully' });
    } catch (error) {
        console.error('Error adding items to inventory:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const viewItems = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT name, price, quantityAvailable, category FROM inventory';
        const items: Inventory[] = await executeQuery<Inventory>(query);
    
        return res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeItems = async (req: Request, res: Response) => {
    try {
        const itemIds: number[] = req.body.itemIds;
    
        if (!Array.isArray(itemIds) || itemIds.some(id => isNaN(id) || id <= 0)) {
          return res.status(400).json({ message: 'Invalid item IDs' });
        }
    
        const query = 'DELETE FROM inventory WHERE id IN (?)';
        await executeQuery(query, [itemIds]);

        return res.status(200).json({ message: 'Items removed successfully' });
    } catch (error) {
        console.error('Error removing items from inventory:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateItems = async (req: Request, res: Response) => {
    try {
        const itemId: number = parseInt(req.params.id);
        const { name, price, category }: Inventory = req.body;
        
        if (isNaN(itemId) || itemId <= 0) {
          return res.status(400).json({ message: 'Invalid item ID' });
        }
    
        if (!name || !price || price < 0 || !category) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const query = 'UPDATE inventory SET name = ?, price = ?, category = ? WHERE id = ?';
        const values = [name, price, category, itemId];
        await executeQuery(query, values);
    
        return res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const manageInventory = async (req: Request, res: Response) => {
    try {
        const inventoryItems: Inventory[] = req.body.inventoryItems;
    
        const values = inventoryItems.map(item => [item.id, item.quantityAvailable])
          
        const query = `
            INSERT IGNORE INTO inventory (id, quantityAvailable) 
            VALUES ? AS i 
            ON DUPLICATE KEY UPDATE 
            quantityAvailable = i.quantityAvailable
        `;
        await executeQuery(query, [values]);

        return res.status(200).json({ message: 'Inventory levels updated successfully' });
    } catch (error) {
        console.error('Error updating inventory levels:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
