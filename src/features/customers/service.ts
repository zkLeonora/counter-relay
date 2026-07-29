import {
  getCustomers as getCustomersRepo,
  getCustomerById as getCustomerByIdRepo,
  createCustomer as createCustomerRepo,
  updateCustomer as updateCustomerRepo,
  deleteCustomer as deleteCustomerRepo,
  getDefaultStoreId
} from "./repository";
import { CustomerItem, CreateCustomerInput, UpdateCustomerInput } from "./types";

export async function getCustomersService(options?: { search?: string }): Promise<CustomerItem[]> {
  return await getCustomersRepo(options);
}

export async function getCustomerByIdService(id: string): Promise<CustomerItem | null> {
  return await getCustomerByIdRepo(id);
}

export async function createCustomerService(input: CreateCustomerInput): Promise<CustomerItem> {
  const storeId = await getDefaultStoreId();
  return await createCustomerRepo(input, storeId);
}

export async function updateCustomerService(input: UpdateCustomerInput): Promise<CustomerItem> {
  const existing = await getCustomerByIdRepo(input.id);
  if (!existing) throw new Error("Customer not found");
  return await updateCustomerRepo(input);
}

export async function deleteCustomerService(id: string): Promise<boolean> {
  const existing = await getCustomerByIdRepo(id);
  if (!existing) throw new Error("Customer not found");
  return await deleteCustomerRepo(id);
}
