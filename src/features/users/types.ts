import { UserRole } from "@/lib/auth/roles";

export interface UserItem {
  id: string;
  storeId: string;
  authUserId: string | null;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserInput extends CreateUserInput {
  id: string;
}
