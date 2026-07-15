"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function checkoutAction(cart: { itemId: number; qty: number; price: number }[], outlet: string = "Retail") {
  const user = await getCurrentUser();
  if (!user || !["Cashier", "Retail Cashier", "Bar Cashier"].includes(user.role) || !user.farmId) {
    return { error: "Unauthorized" };
  }

  try {
    const totalAmount = cart.reduce((acc, c) => acc + c.qty * c.price, 0);
    const invoiceNumber = `POS-${Date.now().toString().slice(-6)}`;

    // Create the invoice and deduct stock in a transaction
    await prisma.$transaction(async (tx) => {
      const invoice = await tx.salesInvoice.create({
        data: {
          invoiceNumber,
          farmId: user.farmId!,
          outlet: outlet,
          status: "Paid",
          totalAmount,
          lines: {
            create: cart.map(c => ({
              description: `Item ID ${c.itemId}`, // Ideally fetch the real name, but simplified for POC
              quantity: c.qty,
              unitPrice: c.price,
              totalPrice: c.qty * c.price
            }))
          }
        }
      });

      // Deduct stock
      for (const item of cart) {
        const currentItem = await tx.inventoryItem.findUnique({ where: { id: item.itemId } });
        if (currentItem) {
          await tx.inventoryItem.update({
            where: { id: item.itemId },
            data: { currentStock: currentItem.currentStock - item.qty }
          });

          await tx.stockMovement.create({
            data: {
              itemId: item.itemId,
              movementType: "Sale",
              quantity: -item.qty,
              reference: invoice.invoiceNumber,
              notes: "POS Sale"
            }
          });
        }
      }
    });

    revalidatePath("/pos");
    revalidatePath("/bar");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Transaction failed." };
  }
}
