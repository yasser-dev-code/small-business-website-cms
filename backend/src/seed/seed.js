import { connectDB, disconnectDB } from '../config/db.js';
import env from '../config/env.js';
import { seedData } from './seedData.js';

async function run() {
  await connectDB();
  const counts = await seedData();
  console.log('[seed] Database seeded successfully:', counts);
  console.log(`[seed] Demo admin login -> email: ${env.demoAdminEmail} | password: ${env.demoAdminPassword}`);
}

run()
  .then(() => disconnectDB())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] Failed:', err);
    process.exit(1);
  });
