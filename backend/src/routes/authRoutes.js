import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { login, me, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { runValidation } from '../middleware/validate.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
], runValidation, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;
