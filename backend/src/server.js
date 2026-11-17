import env from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

async function start() {
  await connectDB();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] Maison Gourmet CMS API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
