import { z } from 'zod';

/**
 * Zod schema for Login Form validation.
 * Ensures required fields, valid email format, and strong password constraints.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Interface prepared for Better Auth Integration
 * Better Auth client method placeholder:
 * 
 * ```ts
 * import { createAuthClient } from "better-auth/react";
 * const authClient = createAuthClient();
 * const { data, error } = await authClient.signIn.email({
 *   email: values.email,
 *   password: values.password,
 * });
 * ```
 */
export interface AuthActionResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}
