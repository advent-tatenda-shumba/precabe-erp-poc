import { prisma } from "@/lib/prisma";
import { AddStockButton, TransferStockButton, LogFuelDeliveryButton } from "./InventoryForms";

export const dynamic = "force-dynamic";

function stockStatus(current: number, reorder: number) {
  if (current === 0) return { label: "Out of Stock", cls: "badge-red" };
  if (current <= reorder * 0.5) return { label: "Critical", cls: "badge-red" };
  if (current <= reorder) return { label: "Low Stock", cls: "badge-orange" };
  return { label: "Optimal", cls: "badge-green" };
}

function pct(current: number, capacity: number) {
  return Math.min(100, Math.round((current / capacity) * 100));
}

export default async function Inventory() {
  const [items, tanks, movements, warehouses] = await Promise.all([
    prisma.inventoryItem.findMany({
      include: { warehouse: { include: { farm: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.fuelTank.findMany({ include: { farm: true }, orderBy: { farmId: "asc" } }),
    prisma.stockMovement.findMany({ orderBy: { date: "desc" }, take: 15, include: { item: true } }),
    prisma.warehouse.findMany({ include: { farm: true } }),
  ]);

  const categories = [...new Set(items.map((i) => i.category))];
  const totalStockValue = items.reduce((a, i) => a + i.currentStock * i.unitCost, 0);
  const alertCount = items.filter((i) => i.currentStock <= i.reorderLevel).length;

  return (
    <div>
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p>Multi-location stock tracking across all farms — real-time levels, fuel tanks, and movements.</p>
      </div>

      {/* Summary */}
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Stock Items</div>
          <div className="stat-value">{items.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total Value</div>
          <div className="stat-value">${(totalStockValue / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Low / Critical</div>
          <div className="stat-value" style={{ color: alertCount > 0 ? "var(--danger)" : "var(--success)" }}>{alertCount}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Warehouses</div>
          <div className="stat-value">{[...new Set(items.map(i => i.warehouseId))].length}</div>
        </div>
      </div>

      {/* Fuel Tanks */}
      <div className="card">
        <div className="card-header">
          <h3>⛽ Fuel Tank Levels</h3>
          <LogFuelDeliveryButton tanks={tanks} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {tanks.map((tank) => {
            const p = pct(tank.currentLitres, tank.capacityLitres);
            const color = p > 50 ? "green" : p > 25 ? "orange" : "red";
            return (
              <div key={tank.id} style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{tank.tankCode}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {tank.fuelType} · {tank.farm.name.split(' ')[0]}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                  <span>{tank.currentLitres.toLocaleString()} L</span>
                  <strong>{p}%</strong>
                </div>
                <div className="progress-bar-wrap">
                  <div className={`progress-bar-fill ${color}`} style={{ width: `${p}%` }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Capacity: {tank.capacityLitres.toLocaleString()} L
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock by Category */}
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        return (
          <div key={cat} className="card">
            <div className="card-header">
              <h3>{cat.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <AddStockButton items={catItems} />
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Unit</th>
                    <th>On Hand</th>
                    <th>Reorder Level</th>
                    <th>Unit Cost</th>
                    <th>Total Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {catItems.map((item) => {
                    const st = stockStatus(item.currentStock, item.reorderLevel);
                    return (
                      <tr key={item.id}>
                        <td><code style={{ fontSize: '0.78rem' }}>{item.itemCode}</code></td>
                        <td><strong>{item.name}</strong></td>
                        <td><span className="farm-tag">{item.warehouse.farm.name.split(' ')[0]}</span></td>
                        <td>{item.unit}</td>
                        <td><strong>{item.currentStock.toLocaleString()}</strong></td>
                        <td>{item.reorderLevel}</td>
                        <td>${item.unitCost.toFixed(2)}</td>
                        <td>${(item.currentStock * item.unitCost).toFixed(0)}</td>
                        <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Recent movements */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Stock Movements</h3>
          <TransferStockButton items={items} warehouses={warehouses} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reference</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.date).toLocaleDateString("en-ZW")}</td>
                  <td><strong>{m.item.name}</strong></td>
                  <td>
                    <span className={`badge ${m.movementType === "In" ? "badge-green" : m.movementType === "Out" ? "badge-orange" : "badge-blue"}`}>
                      {m.movementType}
                    </span>
                  </td>
                  <td>{m.quantity} {m.item.unit}</td>
                  <td>{m.reference ?? "—"}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{m.notes ?? "—"}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No stock movements recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
