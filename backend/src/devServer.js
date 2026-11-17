import env from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { seedData } from './seed/seedData.js';
import Admin from './models/Admin.js';

async function start() {
  await connectDB();

  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const counts = await seedData();
    console.log('[devServer] Database was empty - seeded demo content:', counts);
    console.log(`[devServer] Demo admin -> ${env.demoAdminEmail} / ${env.demoAdminPassword}`);
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[devServer] Maison Gourmet CMS API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('[devServer] Failed to start:', err);
  process.exit(1);
});
