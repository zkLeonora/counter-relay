import { config } from 'dotenv';
config({ path: '.env.local' });

import { auth } from '@/lib/auth';

async function testSignUp() {
  console.log('Testing auth.api.signUpEmail...');
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Owner',
      },
    });
    console.log('SignUp Success:', res);
  } catch (err: any) {
    console.error('SignUp Error:', err);
  }
}

testSignUp();
