"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// AGRICULTURE
// ==========================================
export async function createCropCycle(data: { farmId: number; cropId: number; season: string; hectares: number; plantingDate: string }) {
  await prisma.cropCycle.create({
    data: {
      farmId: data.farmId,
      cropId: data.cropId,
      season: data.season,
      hectaresPlanted: data.hectares,
      plantingDate: new Date(data.plantingDate),
      stage: "Planting",
    },
  });
  revalidatePath("/agriculture");
}

// ==========================================
// LIVESTOCK
// ==========================================
export async function createLivestockBatch(data: { farmId: number; species: string; batchCode: string; purpose: string; headCount: number }) {
  await prisma.livestockBatch.create({
    data: {
      farmId: data.farmId,
      species: data.species,
      batchCode: data.batchCode,
      purpose: data.purpose,
      headCount: data.headCount,
    },
  });
  revalidatePath("/livestock");
}

export async function logLivestockEvent(data: { batchId: number; eventType: string; quantity: number; unitValue: number; notes: string; date: string }) {
  await prisma.$transaction(async (tx) => {
    await tx.livestockEvent.create({
      data: {
        batchId: data.batchId,
        eventType: data.eventType,
        quantity: data.quantity,
        unitValue: data.unitValue > 0 ? data.unitValue : null,
        notes: data.notes,
        date: new Date(data.date),
      },
    });

    const batch = await tx.livestockBatch.findUniqueOrThrow({ where: { id: data.batchId } });
    if (data.eventType === "Birth" || data.eventType === "Purchase") {
      await tx.livestockBatch.update({ where: { id: data.batchId }, data: { headCount: batch.headCount + data.quantity } });
    } else if (data.eventType === "Death" || data.eventType === "Sale") {
      await tx.livestockBatch.update({ where: { id: data.batchId }, data: { headCount: Math.max(0, batch.headCount - data.quantity) } });
    }
  });
  revalidatePath("/livestock");
}

// ==========================================
// INVENTORY
// ==========================================
export async function addInventoryStock(data: { itemId: number; quantity: number; unitCost: number; notes: string }) {
  await prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUniqueOrThrow({ where: { id: data.itemId } });
    
    await tx.stockMovement.create({
      data: {
        itemId: data.itemId,
        movementType: "In",
        quantity: data.quantity,
        unitCost: data.unitCost,
        notes: data.notes,
      },
    });

    // Weighted average cost update (simplified)
    const totalCurrentValue = item.currentStock * item.unitCost;
    const addedValue = data.quantity * data.unitCost;
    const newStock = item.currentStock + data.quantity;
    const newCost = newStock > 0 ? (totalCurrentValue + addedValue) / newStock : data.unitCost;

    await tx.inventoryItem.update({
      where: { id: data.itemId },
      data: { currentStock: newStock, unitCost: newCost },
    });
  });
  revalidatePath("/inventory");
}

export async function transferStock(data: { itemId: number; quantity: number; toWarehouseId: number; notes: string }) {
  await prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUniqueOrThrow({ where: { id: data.itemId } });
    if (item.currentStock < data.quantity) throw new Error("Insufficient stock");

    // 1. Log outbound movement
    await tx.stockMovement.create({
      data: { itemId: data.itemId, movementType: "Out", quantity: data.quantity, toWarehouseId: data.toWarehouseId, notes: data.notes },
    });

    // 2. Reduce stock at source
    await tx.inventoryItem.update({ where: { id: data.itemId }, data: { currentStock: item.currentStock - data.quantity } });

    // 3. Find or create item at destination
    const targetItem = await tx.inventoryItem.findFirst({ where: { itemCode: item.itemCode, warehouseId: data.toWarehouseId } });
    if (targetItem) {
      await tx.inventoryItem.update({ where: { id: targetItem.id }, data: { currentStock: targetItem.currentStock + data.quantity } });
    } else {
      await tx.inventoryItem.create({
        data: {
          itemCode: `${item.itemCode}-${data.toWarehouseId}`,
          name: item.name,
          category: item.category,
          unit: item.unit,
          reorderLevel: item.reorderLevel,
          currentStock: data.quantity,
          unitCost: item.unitCost,
          warehouseId: data.toWarehouseId,
        },
      });
    }
  });
  revalidatePath("/inventory");
}

export async function logFuelDelivery(data: { tankId: number; litres: number; reference: string }) {
  await prisma.$transaction(async (tx) => {
    await tx.fuelTransaction.create({
      data: { tankId: data.tankId, txType: "Delivery", litres: data.litres, reference: data.reference },
    });
    const tank = await tx.fuelTank.findUniqueOrThrow({ where: { id: data.tankId } });
    await tx.fuelTank.update({
      where: { id: data.tankId },
      data: { currentLitres: Math.min(tank.capacityLitres, tank.currentLitres + data.litres) },
    });
  });
  revalidatePath("/inventory");
}

// ==========================================
// PURCHASING
// ==========================================
export async function createPurchaseOrder(data: { contactId: number; farmId: number; totalAmount: number; notes: string; lines: { description: string; quantity: number; unitPrice: number; totalPrice: number }[] }) {
  await prisma.purchaseOrder.create({
    data: {
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      contactId: data.contactId,
      farmId: data.farmId,
      status: "Pending",
      totalAmount: data.totalAmount,
      notes: data.notes,
      lines: { create: data.lines },
    },
  });
  revalidatePath("/purchasing");
}

export async function approvePurchaseOrder(poId: number) {
  await prisma.purchaseOrder.update({
    where: { id: poId },
    data: { status: "Approved" },
  });
  revalidatePath("/purchasing");
}

// ==========================================
// SALES
// ==========================================
export async function createSalesInvoice(data: { contactId: number | null; farmId: number; outlet: string; totalAmount: number; lines: { description: string; quantity: number; unitPrice: number; totalPrice: number }[] }) {
  await prisma.salesInvoice.create({
    data: {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      contactId: data.contactId,
      farmId: data.farmId,
      outlet: data.outlet,
      status: "Paid",
      totalAmount: data.totalAmount,
      lines: { create: data.lines },
    },
  });
  revalidatePath("/sales");
}

// ==========================================
// PAYROLL
// ==========================================
export async function runPayroll(data: { month: string }) {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.payroll.findFirst({ where: { month: data.month } });
    if (existing) throw new Error("Payroll already run for this month");

    const staffList = await tx.staff.findMany();
    
    let totalGross = 0;
    let totalPaye = 0;
    let totalNssa = 0;
    let totalNet = 0;

    const lines = staffList.map((s) => {
      const gross = s.salary;
      const nssa = Math.min(gross * 0.045, 57.33); // 4.5% up to ceiling
      
      let paye = 0;
      const taxable = gross - nssa;
      if (taxable > 100) {
        if (taxable <= 300) paye = (taxable - 100) * 0.20;
        else if (taxable <= 1000) paye = (200 * 0.20) + ((taxable - 300) * 0.25);
        else paye = (200 * 0.20) + (700 * 0.25) + ((taxable - 1000) * 0.30);
      }

      const net = gross - nssa - paye;
      
      totalGross += gross;
      totalPaye += paye;
      totalNssa += nssa;
      totalNet += net;

      return {
        staffId: s.id,
        grossSalary: gross,
        paye,
        nssa,
        otherDeductions: 0,
        netSalary: net,
        month: data.month,
      };
    });

    await tx.payroll.create({
      data: {
        month: data.month,
        totalGross,
        totalPaye,
        totalNssa,
        totalNet,
        lines: { create: lines },
      },
    });
  });
  revalidatePath("/payroll");
}

// ==========================================
// MANUFACTURING
// ==========================================
export async function createProductionOrder(data: { bomId: number; quantity: number }) {
  await prisma.productionOrder.create({
    data: {
      bomId: data.bomId,
      quantity: data.quantity,
      status: "Planned",
    },
  });
  revalidatePath("/manufacturing");
}

// ==========================================
// FIXED ASSETS
// ==========================================
export async function createFixedAsset(data: { name: string; category: string; farmId: number; purchaseDate: string; purchaseCost: number; usefulLifeYears: number; residualValue: number }) {
  await prisma.fixedAsset.create({
    data: {
      assetTag: `AST-${Date.now().toString().slice(-6)}`,
      name: data.name,
      category: data.category,
      farmId: data.farmId,
      purchaseDate: new Date(data.purchaseDate),
      purchaseCost: data.purchaseCost,
      usefulLifeYears: data.usefulLifeYears,
      residualValue: data.residualValue,
    },
  });
  revalidatePath("/fixed-assets");
}

// ==========================================
// ADDRESS BOOK / CRM
// ==========================================
export async function createContact(data: { name: string; contactType: string; phone: string; email: string; address: string; country: string }) {
  await prisma.contact.create({
    data: {
      name: data.name,
      contactType: data.contactType,
      phone: data.phone,
      email: data.email,
      address: data.address,
      country: data.country,
    },
  });
  revalidatePath("/address-book");
  revalidatePath("/crm");
}

// ==========================================
// SETUP
// ==========================================
export async function createFarm(data: { name: string; location: string; sizeHectares: number }) {
  await prisma.farm.create({
    data: {
      name: data.name,
      location: data.location,
    },
  });
  revalidatePath("/setup");
}

export async function createBankAccount(data: { farmId: number; bankName: string; accountNumber: string; currency: string; balance: number }) {
  await prisma.bankAccount.create({
    data: {
      farmId: data.farmId,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      currency: data.currency,
      balance: data.balance,
    },
  });
  revalidatePath("/setup");
}

