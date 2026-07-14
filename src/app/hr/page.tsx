import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import HrClient from "./HrClient";

export const dynamic = "force-dynamic";

export default async function HrPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const staff = await prisma.staff.findMany({
    where: { farmId: user.farmId ?? 0 },
    include: {
      payrollLines: true
    },
    orderBy: { name: "asc" }
  });

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <HrClient staff={staff} userName={user.name} />
    </div>
  );
}
