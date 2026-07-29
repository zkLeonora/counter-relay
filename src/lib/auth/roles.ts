export type UserRole = 'owner' | 'manager' | 'cashier';

export interface UserSessionProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId: string;
}
