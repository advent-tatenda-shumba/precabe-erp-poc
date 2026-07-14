"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function addStaffAction(data: { name: string; role: string; employeeType: string; salary: number; costAllocation: string }) {
  const user = await getCurrentUser();
  if (!user || !user.farmId) return { error: "Unauthorized" };

  try {
    const code = `EMP-${Date.now().toString().slice(-4)}`;
    
    await prisma.staff.create({
      data: {
        name: data.name,
        employeeCode: code,
        role: data.role,
        employeeType: data.employeeType,
        salary: data.salary,
        costAllocation: data.costAllocation,
        farmId: user.farmId
      }
    });

    revalidatePath("/hr");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add employee" };
  }
}
