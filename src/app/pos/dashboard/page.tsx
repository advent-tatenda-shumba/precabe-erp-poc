import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PosDashboardPage() {
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
  const totalProducts = items.length;
  const lowStockItems = items.filter(i => i.currentStock < 5).length;

  // Mock Top 5 Products data
  const topProducts = items.slice(0, 5).map((item, idx) => ({
    name: item.name,
    sold: Math.floor(Math.random() * 100) + 10 // Mock sales data for the chart
  })).sort((a, b) => b.sold - a.sold);
  const maxSold = Math.max(...topProducts.map(p => p.sold));

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Dashboard - SHOP1</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", border: "1px solid #e5e7eb", borderLeft: "4px solid #facc15", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>{lowStockItems}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Low Stock Items</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", border: "1px solid #e5e7eb", borderLeft: "4px solid #16a34a", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>{totalProducts}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Total Products</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Top 5 Products Chart */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem" }}>Top 5 Products (Today)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {topProducts.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "120px", fontSize: "0.75rem", color: "#4b5563", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
                </div>
                <div style={{ flex: 1, backgroundColor: "#f3f4f6", height: "30px" }}>
                  <div style={{ width: `${(p.sold / maxSold) * 100}%`, backgroundColor: "#4f46e5", height: "100%" }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#4f46e5", display: "inline-block" }}></span> Units Sold
          </div>
        </div>

        {/* Product Categories Pie Chart Mock */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem" }}>Product Categories</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
             {/* CSS-only pie chart using conic-gradient */}
             <div style={{
               width: "180px", height: "180px", borderRadius: "50%",
               background: "conic-gradient(#0ea5e9 0% 15%, #14b8a6 15% 35%, #fbbf24 35% 50%, #8b5cf6 50% 85%, #f43f5e 85% 100%)",
               position: "relative"
             }}>
             </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "1rem", fontSize: "0.75rem", color: "#4b5563" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "10px", height: "10px", backgroundColor: "#0ea5e9" }}></span> Beverages</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "10px", height: "10px", backgroundColor: "#14b8a6" }}></span> General</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "10px", height: "10px", backgroundColor: "#fbbf24" }}></span> Household</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "10px", height: "10px", backgroundColor: "#8b5cf6" }}></span> Food Items</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "10px", height: "10px", backgroundColor: "#f43f5e" }}></span> Misc</div>
          </div>
        </div>
      </div>
    </div>
  );
}
