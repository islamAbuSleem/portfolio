import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  console.log('🌱 Seeding database...');

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email,
    passwordHash,
    name: 'Admin User',
    role: 'admin',
  }).onConflictDoNothing();

  console.log(`✅ Admin user created: ${email} / ${password}`);
  console.log('⚠️  Make sure to change the password in production!');
  process.exit(0);
};

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
