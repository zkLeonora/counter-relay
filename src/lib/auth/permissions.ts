import { UserRole } from './roles';

export type ViewPermission = 
  | 'dashboard'
  | 'counter'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'reports'
  | 'users'
  | 'store'
  | 'settings';

export const ROLE_PERMISSIONS: Record<UserRole, ViewPermission[]> = {
  owner: ['dashboard', 'counter', 'orders', 'products', 'categories', 'inventory', 'customers', 'reports', 'users', 'store', 'settings'],
  manager: ['dashboard', 'counter', 'orders', 'products', 'categories', 'inventory', 'customers', 'reports'],
  cashier: ['dashboard', 'counter', 'orders', 'products', 'customers'],
};

export function canAccessView(role: UserRole, view: ViewPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['cashier'];
  return allowed.includes(view);
}

export function canManageProducts(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canManageCategories(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canViewReports(role: UserRole): boolean {
  return role === 'owner' || role === 'manager';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'owner';
}

export function canAccessSettings(role: UserRole): boolean {
  return role === 'owner';
}
