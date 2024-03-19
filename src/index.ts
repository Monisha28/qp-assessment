import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import { verifyToken } from './controllers/authController';
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// Authentication Routes
app.use('/auth', authRoutes);

// Admin Routes
app.use('/admin', verifyToken, adminRoutes);

// User Routes
app.use('/user', verifyToken, userRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});