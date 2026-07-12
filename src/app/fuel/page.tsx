import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import FuelClient from "./FuelClient";

export const dynamic = "force-dynamic";

export default async function FuelPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Fuel Attendant") {
    redirect("/login");
  }

  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 },
    include: {
      fuelTanks: true
    }
  });

  if (!farm) {
    return <div style={{ padding: "2rem" }}>No farm assigned to your account.</div>;
  }

  const recentTxs = await prisma.fuelTransaction.findMany({
    where: { tank: { farmId: farm.id } },
    orderBy: { date: "desc" },
    take: 50,
    include: { tank: true }
  });

  return <FuelClient tanks={farm.fuelTanks} recentTxs={recentTxs as any} farmName={farm.name} userName={user.name} />;
}
