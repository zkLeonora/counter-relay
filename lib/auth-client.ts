import { createAuthClient } from "better-auth/react";

/**
 * Client-side Better Auth Client
 * Handles authentication actions (signIn, signUp, signOut, useSession) on the browser.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
