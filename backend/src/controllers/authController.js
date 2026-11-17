import Admin from '../models/Admin.js';
import { signToken } from '../middleware/auth.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = signToken(admin);
    res.json({ token, admin: admin.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ admin: req.admin.toPublicJSON() });
}

export async function logout(req, res) {
  res.json({ message: 'Logged out successfully.' });
}
