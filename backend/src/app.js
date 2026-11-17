import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { uploadRoot } from './middleware/upload.js';

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: [env.clientOrigin, 'http://localhost:5173', 'http://localhost:4173'], credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(uploadRoot));

  app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.use('/api/auth', authRoutes);
  app.use('/api', publicRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
