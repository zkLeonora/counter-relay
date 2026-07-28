'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Contact, Mail, Loader2 } from 'lucide-react';
import { FormField } from './FormField';
import { authClient } from '@/lib/auth-client';
import { createOwnerProfileAndStore } from '@/lib/services/onboarding';

const signUpSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().min(1, { message: 'Email address is required' }).email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  /**
   * Better Auth Registration Flow:
   * 1. Better Auth creates `user` and HttpOnly `session`.
   * 2. Onboarding Service creates default `store` and owner profile in business `users` table.
   * 3. Redirects to POS Dashboard.
   */
  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    setAuthError(null);
    try {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
      });

      if (error) {
        setAuthError(error.message || 'Registration failed. Please try again.');
        return;
      }

      if (data?.user?.id) {
        // Automatically provision Store & Owner Business Profile
        await createOwnerProfileAndStore({
          authUserId: data.user.id,
          email: values.email,
          fullName: values.fullName,
        });
      }

      // Redirect to Dashboard
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('An unexpected registration error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between w-full max-w-sm mx-auto lg:mx-0">
      <div>
        {/* Header Section */}
        <header className="mb-2.5 sm:mb-3 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
            Welcome Counter<br />
            POS System.<br />
            Sign Up<br />
            to getting started
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-1">
            Enter your details to proceed further
          </p>
        </header>

        {/* Global Auth Error Alert */}
        {authError && (
          <div 
            role="alert" 
            className="mb-2.5 p-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl"
          >
            {authError}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit(handleSignUpSubmit)} noValidate className="space-y-2.5">
          <FormField
            id="fullName"
            type="text"
            label="Full name"
            placeholder="Enter your full name"
            autoComplete="name"
            icon={Contact}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <FormField
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email address"
            autoComplete="email"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="new-password"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />

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
                  <span>Signing Up...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-2.5 text-center">
        <p className="text-xs text-slate-400 font-normal">
          Already have an account ?{' '}
          <Link 
            href="/login" 
            className="text-[#5b7cfd] hover:text-indigo-700 font-medium hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  );
}
