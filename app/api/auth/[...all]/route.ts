import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth Wildcard API Route
 * Handles POST /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out, and GET /api/auth/session.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
