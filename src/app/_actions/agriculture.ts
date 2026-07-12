"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function logFieldActivity(formData: FormData) {
  const cropCycleId = Number(formData.get("cropCycleId"));
  const itemId = Number(formData.get("itemId"));
  const quantity = Number(formData.get("quantity"));
  const activityDescription = formData.get("description") as string;

  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item || item.currentStock < quantity) {
      throw new Error("Not enough stock");
    }

    const cycle = await prisma.cropCycle.findUnique({ where: { id: cropCycleId } });
    if (!cycle) throw new Error("Invalid cycle");

    await prisma.$transaction(async (tx) => {
      // Deduct inventory
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: item.currentStock - quantity },
      });

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          itemId,
          movementType: "Usage",
          quantity: -quantity,
          reference: `Cycle-${cropCycleId}`,
          notes: activityDescription,
        },
      });

      // Allocate cost to the crop cycle
      const totalCost = quantity * item.unitCost;
      await tx.cost.create({
        data: {
          amount: totalCost,
          description: `${activityDescription} (${quantity}${item.unit} of ${item.name})`,
          category: "Agricultural Inputs",
          farmId: cycle.farmId,
          cropId: cycle.cropId,
          cropCycleId: cycle.id,
        },
      });
    });

    revalidatePath("/agriculture");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}
