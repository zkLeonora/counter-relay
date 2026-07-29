import { getAuthSession } from './session';
import { UserRole } from './roles';

export async function getCurrentUserRole(): Promise<UserRole> {
  const session = await getAuthSession();
  return (session?.role as UserRole) || 'cashier';
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getAuthSession();
  const role = (session?.role as UserRole) || 'cashier';
  if (!allowedRoles.includes(role)) {
    throw new Error(`403 Forbidden: Privilege restricted for role '${role}'`);
  }
  return session;
}

export async function requireOwner() {
  return await requireRole(['owner']);
}

export async function requireManagerOrOwner() {
  return await requireRole(['owner', 'manager']);
}
