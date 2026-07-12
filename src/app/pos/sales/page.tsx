import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SalesClient from "./SalesClient";

export const dynamic = "force-dynamic";

export default async function PosSalesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Cashier") {
    redirect("/login");
  }

  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 }
  });

  if (!farm) {
    return <div style={{ padding: "2rem" }}>No farm assigned to your account.</div>;
  }

  const invoices = await prisma.salesInvoice.findMany({
    where: { farmId: user.farmId ?? 0 },
    include: {
      lines: true,
    },
    orderBy: { date: "desc" },
    take: 100
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%", fontFamily: "sans-serif" }}>
      <SalesClient invoices={invoices} userName={user.name} farmName={farm.name} />
    </div>
  );
}
