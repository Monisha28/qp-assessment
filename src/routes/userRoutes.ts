import express from 'express';
import { viewAvailableItems, orderGroceryItems } from '../controllers/userController';
import { validateOrder } from '../services/validationService';

const router = express.Router();

router.get('/items/view-available', viewAvailableItems);
router.post('/items/order', validateOrder, orderGroceryItems);

export default router;
