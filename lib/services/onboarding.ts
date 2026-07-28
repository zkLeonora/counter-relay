'use server';

import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema/stores";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

/**
 * Onboarding Service for New Owner Registration
 * Flow:
 * 1. Creates a new default Store for the registered owner.
 * 2. Creates the Owner Profile in the business `users` table linked to Better Auth `authUserId`.
 */
export async function createOwnerProfileAndStore({
  authUserId,
  email,
  fullName,
}: {
  authUserId: string;
  email: string;
  fullName: string;
}) {
  try {
    // Check if business profile already exists for this auth user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.authUserId, authUserId),
    });

    if (existingUser) {
      return { success: true, storeId: existingUser.storeId };
    }

    // Generate unique store slug
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${cleanName || 'store'}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Create Business Store
    const [newStore] = await db
      .insert(stores)
      .values({
        name: `${fullName}'s Store`,
        slug: slug,
        email: email,
        currency: 'IDR',
        timezone: 'Asia/Jakarta',
        isActive: true,
      })
      .returning();

    // 2. Create Business Owner Profile
    const [newOwner] = await db
      .insert(users)
      .values({
        storeId: newStore.id,
        authUserId: authUserId,
        name: fullName,
        email: email,
        role: 'owner',
        isActive: true,
      })
      .returning();

    return { success: true, storeId: newStore.id, ownerId: newOwner.id };
  } catch (error: any) {
    console.error('Error creating owner profile & store:', error);
    throw new Error(error.message || 'Failed to complete business registration');
  }
}
