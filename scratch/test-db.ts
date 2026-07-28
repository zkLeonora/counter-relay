import postgres from 'postgres';

const pass = 'gengkapak123';
const ref = 'gjafzjmvuexxiwdcoyhq';

const urls = [
  { name: 'Session Pooler (5432)', url: `postgresql://postgres.${ref}:${pass}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` },
  { name: 'Transaction Pooler (6543)', url: `postgresql://postgres.${ref}:${pass}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` },
];

async function testSpeed() {
  for (const item of urls) {
    console.log(`\nTesting ${item.name}...`);
    const start = Date.now();
    try {
      const sql = postgres(item.url, { prepare: false, connect_timeout: 5 });
      const res = await sql`SELECT count(*) FROM pg_tables WHERE schemaname = 'public';`;
      const elapsed = Date.now() - start;
      console.log(`⚡ SUCCESS on ${item.name} in ${elapsed}ms! Table count:`, res[0].count);
      await sql.end();
    } catch (err: any) {
      console.error(`❌ FAILED on ${item.name}:`, err.message);
    }
  }
}

testSpeed();
