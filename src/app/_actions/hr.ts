"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function addStaffAction(data: { name: string; role: string; employeeType: string; salary: number; costAllocation: string; phone?: string; email?: string; address?: string; nextOfKin?: string; notes?: string }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const farmId = user.farmId || 1;

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
        phone: data.phone,
        email: data.email,
        address: data.address,
        nextOfKin: data.nextOfKin,
        notes: data.notes,
        farmId: farmId
      }
    });

    revalidatePath("/hr");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add employee" };
  }
}

export async function updateStaffAction(id: number, data: { name: string; role: string; employeeType: string; salary: number; costAllocation: string; phone?: string; email?: string; address?: string; nextOfKin?: string; notes?: string }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.staff.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        employeeType: data.employeeType,
        salary: data.salary,
        costAllocation: data.costAllocation,
        phone: data.phone,
        email: data.email,
        address: data.address,
        nextOfKin: data.nextOfKin,
        notes: data.notes
      }
    });

    revalidatePath("/hr");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update employee" };
  }
}

export async function updateStaffStatusAction(id: number, status: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.staff.update({
      where: { id },
      data: { status }
    });

    revalidatePath("/hr");
    return { success: true };
  } catch (error) {
    return { error: "Failed to change employee status" };
  }
}
