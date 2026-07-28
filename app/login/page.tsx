import type { Metadata } from 'next';
import { AuthLayout } from '@/app/_components/auth/AuthLayout';
import { LoginForm } from '@/app/_components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Counter POS System',
  description: 'Sign in to access your Counter retail operating system dashboard.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
