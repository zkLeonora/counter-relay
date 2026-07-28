import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

/**
 * Server-side helper to get the active Better Auth session
 * along with the user's linked Counter POS Store and Role details.
 */
export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // Fetch Business Profile & Store from Drizzle DB
  const businessUser = await db.query.users.findFirst({
    where: eq(users.authUserId, session.user.id),
    with: {
      store: true,
    },
  });

  return {
    session,
    authUser: session.user,
    businessUser: businessUser || null,
    store: businessUser?.store || null,
    role: businessUser?.role || 'cashier',
    storeId: businessUser?.storeId || null,
  };
}
