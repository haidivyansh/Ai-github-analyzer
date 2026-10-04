import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 * Attaches the authenticated user document to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify JWT
      const decoded = verifyToken(token);

      // Find user in DB without returning password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Auth Middleware Error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please log in again.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, access token missing'
    });
  }
};

/**
 * Optional Auth middleware: attaches req.user if a valid token is provided,
 * but does not reject the request if no token is present.
 */
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore token validation failure in optional mode
    }
  }
  next();
};
