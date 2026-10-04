import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory before accessing process.env.MONGODB_URI
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    console.error('MongoDB connection error: MONGODB_URI environment variable is missing in backend/.env');
    process.exit(1);
  }

  if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
    console.error('MongoDB connection error: MONGODB_URI in backend/.env is pointing to local MongoDB.');
    console.error('Please set a valid MongoDB Atlas connection string (mongodb+srv://...) in backend/.env');
    process.exit(1);
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    console.error('MongoDB connection error: Please replace <username> and <password> in backend/.env with your real MongoDB Atlas credentials.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri.trim(), {
      dbName: 'ai-github-analyzer',
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error(`MongoDB connection warning: ${error.message}. Backend will continue running in memory/cached mode.`);
    // Schedule background retry
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectDB().catch(() => {});
    }, 10000);
    return null;
  }
};

export const getDBStatus = () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return stateMap[mongoose.connection.readyState] || 'disconnected';
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};



