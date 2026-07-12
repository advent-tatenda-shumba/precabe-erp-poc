import type { Metadata } from "next";
import "../globals.css";
import ToastProvider from "../_components/ToastProvider";
import PosNavbar from "./_components/PosNavbar";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "POS System — Precabe ERP",
  description: "Point of Sale for Precabe Enterprises",
};

export const dynamic = "force-dynamic";

export default async function PosLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Cashier") {
    redirect("/login");
  }

  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 },
  });

  if (!farm) {
    return <div style={{ padding: "2rem" }}>No farm assigned to your account.</div>;
  }

  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f3f4f6" }}>
        <PosNavbar farmName={farm.name} userName={user.name} />
        {children}
      </div>
    </ToastProvider>
  );
}
