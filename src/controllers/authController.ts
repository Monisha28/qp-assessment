import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { executeQuery } from '../services/dbService';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "";

interface AuthenticatedRequest extends Request {
    user: {
      userId: number;
      role: string;
    };
}

export const generateToken = (user: User): string => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (req: Request, res: Response, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    // @ts-ignore
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const isAdmin = authenticatedReq.user.role === 'admin';
      if (!isAdmin) {
        return res.status(403).json({ message: 'Admin privileges required' });
      }
      next();
    } catch (error) {
      console.error('Error verifying admin:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
    try {
        const results = await executeQuery<User>('SELECT * FROM user WHERE username = ? AND password = ?', [
          username,
          password,
        ]);
        return results.length ? results[0] : null;
      } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
};
