import mongoose from 'mongoose';
import env from './env.js';

let memoryServer = null;

async function resolveUri() {
  if (env.mongoUri) {
    try {
      await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
      return;
    } catch (err) {
      console.warn(`[db] Could not reach MONGO_URI (${err.message}). Falling back to in-memory MongoDB.`);
      await mongoose.disconnect().catch(() => {});
    }
  }
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri('maison_gourmet_cms');
  await mongoose.connect(uri);
  console.log('[db] Connected to in-memory MongoDB (no local MongoDB required).');
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await resolveUri();
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
