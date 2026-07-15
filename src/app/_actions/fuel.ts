"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function logFuelAction({ tankId, litres, txType, reference }: { tankId: number; litres: number; txType: string; reference: string }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Fuel Attendant" || !user.farmId) {
    return { error: "Unauthorized" };
  }

  try {
    const tank = await prisma.fuelTank.findUnique({ where: { id: tankId } });
    if (!tank || tank.farmId !== user.farmId) {
      return { error: "Invalid tank" };
    }

    if (txType === "Dispatch" && tank.currentLitres < litres) {
      return { error: "Not enough fuel in tank." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.fuelTransaction.create({
        data: {
          tankId,
          txType: txType,
          litres,
          reference,
        }
      });

      const updatedLitres = txType === "Receipt" ? tank.currentLitres + litres : tank.currentLitres - litres;

      await tx.fuelTank.update({
        where: { id: tankId },
        data: { currentLitres: updatedLitres }
      });
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Transaction failed." };
  }
}
