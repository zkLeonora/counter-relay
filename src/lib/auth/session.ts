import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

/**
 * Server-side helper to get the active Better Auth session
 * along with the user's linked Counter POS Store and Role details.
 */
export async function getAuthSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    let businessUser = null;
    try {
      businessUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
        with: {
          store: true,
        },
      });
    } catch (dbErr) {
      console.warn("Could not fetch business profile from DB in session lookup:", dbErr);
    }

    return {
      session,
      authUser: session.user,
      businessUser: businessUser || null,
      store: businessUser?.store || null,
      role: businessUser?.role || 'owner',
      storeId: businessUser?.storeId || null,
    };
  } catch (error) {
    console.warn("getAuthSession graceful fallback:", error);
    return null;
  }
}
