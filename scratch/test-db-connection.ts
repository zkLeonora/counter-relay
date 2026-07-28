import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';

const url6543 = process.env.DATABASE_URL!;
const url5432 = url6543.replace(':6543/', ':5432/');

async function test(name: string, connUrl: string, opts: any) {
  console.log(`\nTesting ${name}...`);
  try {
    const client = postgres(connUrl, opts);
    const res = await client`SELECT count(*) FROM "user";`;
    console.log(`✅ SUCCESS ${name}! Count:`, res[0]);
    await client.end();
  } catch (err: any) {
    console.error(`❌ FAILED ${name}:`, err.message, err.cause?.code || err.code || '');
  }
}

async function run() {
  await test('Port 6543 default', url6543, { prepare: false });
  await test('Port 6543 ssl require', url6543, { prepare: false, ssl: 'require' });
  await test('Port 5432 default', url5432, { prepare: false });
  await test('Port 5432 ssl require', url5432, { prepare: false, ssl: 'require' });
}

run();
