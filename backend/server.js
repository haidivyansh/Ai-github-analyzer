import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately before module imports from backend dir or root
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();


import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import repositoryRoutes from './routes/repositoryRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';


// Start Express
const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration for local development and client origin
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.options('*', cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Root route fallback
app.get('/', (req, res) => {
  res.json({ message: 'AI GitHub Project Analyzer API Server', status: 'running' });
});

// 404 Route Handler
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

// Global process error handlers to prevent backend termination
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception occurred in backend:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection in backend:', reason);
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Initial MongoDB connection deferred:', err.message);
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  });
};

startServer();

export default app;
