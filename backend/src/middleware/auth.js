import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Admin from '../models/Admin.js';

export function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const decoded = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(decoded.sub);
    if (!admin) return res.status(401).json({ message: 'Account no longer exists.' });
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
