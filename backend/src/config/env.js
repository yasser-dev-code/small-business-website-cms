import dotenv from 'dotenv';
dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB || '5', 10),
  demoAdminEmail: process.env.DEMO_ADMIN_EMAIL || 'admin@maisongourmet.com',
  demoAdminPassword: process.env.DEMO_ADMIN_PASSWORD || 'Admin123!',
  demoAdminName: process.env.DEMO_ADMIN_NAME || 'Maison Gourmet Owner'
};

export default env;
