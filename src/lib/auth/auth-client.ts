import { createAuthClient } from "better-auth/react";

/**
 * Client-side Better Auth Client
 * Handles authentication actions (signIn, signUp, signOut, useSession) on the browser.
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined),
});

export const { signIn, signUp, signOut, useSession } = authClient;
