import { config } from 'dotenv';
config({ path: '.env.local' });

async function testOnboarding() {
  const { createOwnerProfileAndStore } = await import('@/lib/services/onboarding');
  console.log('Testing with loaded DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'EMPTY');
  try {
    const res = await createOwnerProfileAndStore({
      authUserId: `auth-${Date.now()}`,
      email: `test-owner-${Date.now()}@example.com`,
      fullName: 'Test Store Owner',
    });
    console.log('🎉 ONBOARDING SUCCESS:', res);
  } catch (err: any) {
    console.error('❌ Onboarding Error:', err.message);
  }
}

testOnboarding();
