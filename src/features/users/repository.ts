import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema/users";
import { stores } from "@/lib/db/schema/stores";
import { eq, desc, and, ilike, or } from "drizzle-orm";
import { UserItem, CreateUserInput, UpdateUserInput } from "./types";
import { UserRole } from "@/lib/auth/roles";

export async function getDefaultStoreId(): Promise<string> {
  try {
    const storeList = await db.select({ id: stores.id }).from(stores).limit(1);
    if (storeList.length > 0) return storeList[0].id;
    const [newStore] = await db.insert(stores).values({
      name: "SoHo Flagship Store",
      slug: "soho-flagship",
      email: "admin@counter-relay.com"
    }).returning({ id: stores.id });
    return newStore.id;
  } catch (error) {
    return "00000000-0000-0000-0000-000000000001";
  }
}

export async function getUsers(options?: { search?: string }): Promise<UserItem[]> {
  try {
    const conditions = [];
    if (options?.search) {
      const query = `%${options.search}%`;
      conditions.push(
        or(
          ilike(users.name, query),
          ilike(users.email, query)
        )
      );
    }

    const rows = await db
      .select()
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt));

    return rows.map((r) => ({
      ...r,
      role: r.role as UserRole,
    }));
  } catch (error) {
    console.warn("Failed to fetch users from DB:", error);
    return [];
  }
}

export async function getUserById(id: string): Promise<UserItem | null> {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!rows[0]) return null;
    return {
      ...rows[0],
      role: rows[0].role as UserRole,
    };
  } catch (error) {
    return null;
  }
}

export async function createUser(input: CreateUserInput, storeId: string): Promise<UserItem> {
  const [created] = await db
    .insert(users)
    .values({
      storeId,
      authUserId: `usr-${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role as any,
      isActive: input.isActive ?? true,
    })
    .returning();

  return {
    ...created,
    role: created.role as UserRole,
  };
}

export async function updateUser(input: UpdateUserInput): Promise<UserItem> {
  const [updated] = await db
    .update(users)
    .set({
      name: input.name,
      email: input.email,
      role: input.role as any,
      isActive: input.isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.id))
    .returning();

  return {
    ...updated,
    role: updated.role as UserRole,
  };
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  return result.length > 0;
}
