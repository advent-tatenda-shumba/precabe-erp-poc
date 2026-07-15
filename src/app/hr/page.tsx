import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import HrClient from "./HrClient";

export const dynamic = "force-dynamic";

export default async function HrPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const staff = await prisma.staff.findMany({
    where: user.farmId ? { farmId: user.farmId } : undefined,
    include: {
      payrollLines: true
    },
    orderBy: { name: "asc" }
  });

  return (
    <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 50%, #fdf2f8 100%)", minHeight: "100vh" }}>
      <HrClient staff={staff} userName={user.name} />
    </div>
  );
}
