/**
 * Seed Admin User
 * ===============
 * Run once to create your admin account:
 *
 *   npx tsx scripts/seed-admin.ts
 *
 * Make sure .env.local is populated with MONGODB_URI before running.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before running.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local');
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
if (!email || !password) {
  console.error('❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const name = process.env.ADMIN_NAME || 'Admin';

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne({ email });

  if (existing) {
    await Admin.updateOne({ email }, { $set: { passwordHash, name } });
    console.log(`✏️   Updated admin: ${email}`);
  } else {
    await Admin.create({ email, name, passwordHash });
    console.log(`🆕  Created admin: ${email}`);
  }

  console.log('\n🎉  Done! Log in at /admin/login');
  console.log(`    Email:    ${email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('❌  Error:', e.message);
  process.exit(1);
});
