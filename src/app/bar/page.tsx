import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import BarClient from "./BarClient";

export const dynamic = "force-dynamic";

export default async function BarPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Bar Cashier") {
    redirect("/login");
  }

  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 },
    include: {
      warehouses: true
    }
  });

  if (!farm) {
    return <div>No farm associated with this user.</div>;
  }

  const items = await prisma.inventoryItem.findMany({
    where: { 
      warehouse: { farmId: farm.id },
      category: "Beverage"
    },
  });

  const recentSales = await prisma.salesInvoice.findMany({
    where: { farmId: farm.id, outlet: "Bar" },
    orderBy: { date: "desc" },
    take: 15,
    include: { lines: true }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar for Bar */}
      <header style={{ padding: "1rem 2rem", backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#f59e0b", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>🍺 Precabe Bar</h1>
        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
          Cashier: <span style={{ color: "white" }}>{user.name}</span> | Farm: <span style={{ color: "white" }}>{farm.name}</span>
        </div>
      </header>
      
      {/* Client Component */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <BarClient items={items} recentSales={recentSales} farmName={farm.name} userName={user.name} />
      </div>
    </div>
  );
}
