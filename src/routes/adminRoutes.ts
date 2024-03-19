import express from 'express';
import { verifyAdmin } from '../controllers/authController';
import {
  addItems,
  viewItems,
  removeItems,
  updateItems,
  manageInventory,
} from '../controllers/adminController';
import { validateAddItems, validateInventoryItems } from '../services/validationService';

const router = express.Router();

router.post('/items/add', verifyAdmin, validateAddItems, addItems);
router.get('/items/view', verifyAdmin, viewItems);
router.delete('/items/remove', verifyAdmin, removeItems);
router.put('/items/update/:id', verifyAdmin, updateItems);
router.put('/inventory/manage', verifyAdmin, validateInventoryItems, manageInventory);

export default router;
