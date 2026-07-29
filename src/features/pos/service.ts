import { processPOSCheckoutTransaction } from "./repository";
import { CheckoutInput, CompletedOrderReceipt } from "./types";

export async function processCheckoutService(input: CheckoutInput): Promise<CompletedOrderReceipt> {
  if (!input.items || input.items.length === 0) {
    throw new Error("Cart cannot be empty for checkout.");
  }
  if (input.total < 0) {
    throw new Error("Order total cannot be negative.");
  }
  if (input.paymentMethod === "cash" && input.amountPaid < input.total) {
    throw new Error("Amount paid must be greater than or equal to total.");
  }

  return await processPOSCheckoutTransaction(input);
}
