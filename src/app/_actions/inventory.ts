"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Allowed roles for inventory management
const ALLOWED_ROLES = ["Admin", "Super Admin", "Farm Manager", "Finance"];

export async function receiveStockAction(itemId: number, quantity: number, notes: string = "Stock Received") {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("Item not found");

      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: item.currentStock + quantity }
      });

      await tx.stockMovement.create({
        data: {
          itemId,
          movementType: "Receipt",
          quantity: quantity,
          reference: `REC-${Date.now().toString().slice(-6)}`,
          notes: `${notes} (by ${user.name})`
        }
      });
    });

    revalidatePath("/inventory");
    revalidatePath("/bar");
    revalidatePath("/pos");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to receive stock" };
  }
}

export async function adjustPriceAction(itemId: number, newCostPrice: number, newSellPrice: number) {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { unitCost: newCostPrice, sellPrice: newSellPrice }
    });

    revalidatePath("/inventory");
    revalidatePath("/bar");
    revalidatePath("/pos");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: "Failed to adjust price" };
  }
}
