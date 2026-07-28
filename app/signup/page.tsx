import type { Metadata } from 'next';
import { AuthLayout } from '@/app/_components/auth/AuthLayout';
import { SignUpForm } from '@/app/_components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | Counter POS System',
  description: 'Create an account to start using Counter POS System.',
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
