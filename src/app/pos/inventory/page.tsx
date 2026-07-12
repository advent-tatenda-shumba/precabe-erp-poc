import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PosInventoryPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Cashier") {
    redirect("/login");
  }

  const farm = await prisma.farm.findUnique({
    where: { id: user.farmId ?? 0 },
    include: {
      warehouses: {
        include: {
          stockItems: {
            where: { category: { in: ["Finished Goods", "Retail"] } }
          }
        }
      }
    }
  });

  if (!farm) {
    return <div style={{ padding: "2rem" }}>No farm assigned to your account.</div>;
  }

  const items = farm.warehouses.flatMap(w => w.stockItems);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Inventory Management</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{ backgroundColor: "#10b981", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", border: "none", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📥</span> Request Stock
          </button>
          <button style={{ backgroundColor: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", border: "none", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🗑️</span> Log Breakage
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <input 
          type="text" 
          placeholder="Search..." 
          style={{ flex: 1, padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "4px", outline: "none", fontSize: "0.875rem" }}
        />
        <select style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "4px", outline: "none", fontSize: "0.875rem", minWidth: "200px" }}>
          <option>All Categories</option>
        </select>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Current System Stock</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontSize: "0.875rem", color: "#374151" }}>{item.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.itemCode || "N/A"}</div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#111827", fontWeight: "bold" }}>
                  {item.currentStock}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  ${(item.unitCost * 2).toFixed(2)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
