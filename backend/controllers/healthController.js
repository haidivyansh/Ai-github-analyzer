import { getDBStatus } from '../config/db.js';

// Health Check Controller
export const getHealthStatus = (req, res) => {
  const dbStatus = getDBStatus();
  
  res.status(200).json({
    success: true,
    message: "Backend is running",
    database: dbStatus
  });
};
