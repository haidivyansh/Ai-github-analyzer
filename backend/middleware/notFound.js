// Middleware for handling non-existent 404 routes
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`
  });
};
