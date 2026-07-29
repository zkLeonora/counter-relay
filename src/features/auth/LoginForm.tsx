'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/auth/auth-schema';
import { authClient } from '@/lib/auth/auth-client';
import { FormField } from './FormField';

function LoginFormContent() {
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isJustRegistered = searchParams.get('registered') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  /**
   * Better Auth Login Handler
   * Authenticates user email/password, sets HttpOnly session cookie, and redirects to Dashboard.
   */
  const handleFormSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setAuthError(error.message || 'Invalid email or password.');
        return;
      }

      // Successful login -> Redirect to POS Dashboard
      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('An unexpected authentication error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between w-full max-w-sm mx-auto lg:mx-0">
      <div>
        {/* Header Section */}
        <header className="mb-3.5 sm:mb-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
            Welcome Counter<br />
            POS System.<br />
            Sign In<br />
            to getting started
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-1">
            Enter your details to proceed further
          </p>
        </header>

        {/* Registration Success Banner */}
        {isJustRegistered && !authError && (
          <div 
            role="status" 
            className="mb-3 p-2.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account created successfully! Please sign in with your email & password.</span>
          </div>
        )}

        {/* Global Auth Error Alert */}
        {authError && (
          <div 
            role="alert" 
            className="mb-2.5 p-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl"
          >
            {authError}
          </div>
        )}

        {/* Form Fields Section */}
        <form 
          onSubmit={handleSubmit(handleFormSubmit)} 
          noValidate 
          className="space-y-3"
        >
          {/* Email Field */}
          <FormField
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password Field */}
          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={Lock}
            error={errors.password?.message}
            rightAction={
              <Link 
                href="/forgot-password" 
                className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:underline"
              >
                Forgot Password?
              </Link>
            }
            {...register('password')}
          />

          {/* Actions: Sign In CTA Button */}
          <div className="pt-1.5 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-40 h-10 bg-[#5b7cfd] hover:bg-indigo-600 text-white 
                text-sm font-semibold rounded-full transition-all duration-150 
                shadow-sm flex items-center justify-center gap-2 cursor-pointer 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Link Section */}
      <footer className="mt-3 text-center">
        <p className="text-xs text-slate-400 font-normal">
          Don&apos;t have an account ?{' '}
          <Link 
            href="/signup" 
            className="text-[#5b7cfd] hover:text-indigo-700 font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </footer>
    </div>
  );
}

export function LoginForm() {
  return (
    <React.Suspense fallback={<div className="text-xs text-slate-400 text-center py-4">Loading...</div>}>
      <LoginFormContent />
    </React.Suspense>
  );
}
