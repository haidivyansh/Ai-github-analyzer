import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Ephemeral in-memory secret generated only if JWT_SECRET is omitted in development
let devEphemeralSecret = null;

const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
    return process.env.JWT_SECRET.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SECURITY CONFIGURATION ERROR: JWT_SECRET environment variable is required in production.');
  }

  if (!devEphemeralSecret) {
    console.warn('[SECURITY WARNING]: JWT_SECRET is not defined in backend/.env. Using an ephemeral random session secret.');
    devEphemeralSecret = crypto.randomBytes(32).toString('hex');
  }

  return devEphemeralSecret;
};

/**
 * Generate a signed JWT for a given user ID
 * @param {string} id - The MongoDB ObjectId string of the user
 * @returns {string} - Signed JWT token string
 */
export const generateToken = (id) => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: id?.toString() || id }, secret, { expiresIn });
};

/**
 * Verify a JWT and return the decoded payload
 * @param {string} token - The JWT string
 * @returns {object} - Decoded payload
 */
export const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};
