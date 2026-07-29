import { 
  getUsers as getUsersRepo, 
  getUserById as getUserByIdRepo, 
  createUser as createUserRepo, 
  updateUser as updateUserRepo, 
  deleteUser as deleteUserRepo,
  getDefaultStoreId
} from "./repository";
import { UserItem, CreateUserInput, UpdateUserInput } from "./types";

export async function getUsersService(options?: { search?: string }): Promise<UserItem[]> {
  return await getUsersRepo(options);
}

export async function getUserByIdService(id: string): Promise<UserItem | null> {
  return await getUserByIdRepo(id);
}

export async function createUserService(input: CreateUserInput): Promise<UserItem> {
  const storeId = await getDefaultStoreId();
  return await createUserRepo(input, storeId);
}

export async function updateUserService(input: UpdateUserInput): Promise<UserItem> {
  const existing = await getUserByIdRepo(input.id);
  if (!existing) throw new Error("User not found");
  return await updateUserRepo(input);
}

export async function deleteUserService(id: string): Promise<boolean> {
  const existing = await getUserByIdRepo(id);
  if (!existing) throw new Error("User not found");
  return await deleteUserRepo(id);
}
