import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import PosClient from "./PosClient";

export const dynamic = "force-dynamic";

export default async function PosPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Cashier") {
    redirect("/login");
  }

  // Find farm assigned to user
  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 },
    include: {
      warehouses: {
        include: {
          stockItems: {
            where: { currentStock: { gt: 0 }, category: { in: ["Finished Goods", "Retail"] } }
          }
        }
      }
    }
  });

  if (!farm) {
    return <div style={{ padding: "2rem" }}>No farm assigned to your account.</div>;
  }

  // Aggregate stock items from warehouses
  const items = farm.warehouses.flatMap(w => w.stockItems);

  return <PosClient items={items} farmName={farm.name} userName={user.name} />;
}
