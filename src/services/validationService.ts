import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const itemSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantityAvailable: Joi.number().min(0).required(),
        category: Joi.string().required()
    })
);

export const validateAddItems = (req: Request, res: Response, next: NextFunction) => {
    const { error } = itemSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const inventoryItemSchema = Joi.array().items(
    Joi.object({
        id: Joi.number().required(),
        quantityAvailable: Joi.number().min(0).required()
    })
);

export const validateInventoryItems = (req: Request, res: Response, next: NextFunction) => {
    const { error } = inventoryItemSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};


const productSchema = Joi.object({
    productId: Joi.number().required(),
    orderedQuantity: Joi.number().min(1).required(),
    unitSellingPrice: Joi.number().min(0).required() 
});

const orderSchema = Joi.object({
    userId: Joi.number().required(),
    products: Joi.array().items(productSchema).required(),
    totalPrice: Joi.number().min(0).required()
});

export const validateOrder = (req: Request,  res: Response, next: NextFunction) => {
    const { error } = orderSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};