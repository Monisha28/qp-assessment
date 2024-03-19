import express from 'express';
import { authenticateUser, generateToken } from '../controllers/authController';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
  const user: User | null = await authenticateUser(req.body.username, req.body.password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = generateToken(user);
  return res.status(200).json({ token });
});

export default router;
