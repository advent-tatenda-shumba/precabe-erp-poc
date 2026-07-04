import { prisma } from "@/lib/prisma";
import { NewProductionOrderButton } from "./ManufacturingForms";

export const dynamic = "force-dynamic";

export default async function Manufacturing() {
  const [boms, orders, items] = await Promise.all([
    prisma.billOfMaterials.findMany({ include: { lines: { include: { item: true } }, productionOrders: { orderBy: { date: "desc" } } } }),
    prisma.productionOrder.findMany({ include: { bom: true }, orderBy: { date: "desc" } }),
    prisma.inventoryItem.findMany({ where: { category: "RawMaterial" } }),
  ]);

  const totalProduced = orders.filter(o => o.status === "Complete").reduce((a, o) => a + o.quantity, 0);
  const inProgress = orders.filter(o => o.status === "InProgress").length;

  return (
    <div>
      <div className="page-header">
        <h2>Manufacturing — Bakery</h2>
        <p>Bill of Materials, production orders, raw material consumption and finished goods output.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block"><div className="stat-label">BOM Recipes</div><div className="stat-value">{boms.length}</div></div>
        <div className="stat-block"><div className="stat-label">Orders Total</div><div className="stat-value">{orders.length}</div></div>
        <div className="stat-block"><div className="stat-label">In Progress</div><div className="stat-value" style={{ color: "var(--warning)" }}>{inProgress}</div></div>
        <div className="stat-block"><div className="stat-label">Units Produced</div><div className="stat-value">{totalProduced.toLocaleString()}</div></div>
      </div>

      {/* Bills of Materials */}
      {boms.map((bom) => (
        <div key={bom.id} className="card">
          <div className="card-header">
            <h3> {bom.productName}</h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Batch Size: {bom.batchSize} {bom.unit}s</span>
          </div>

          <h4 style={{ fontSize: "0.88rem", marginBottom: "0.75rem" }}>Bill of Materials</h4>
          <table className="table" style={{ marginBottom: "1.25rem" }}>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Qty per Batch</th>
                <th>Unit</th>
                <th>Stock Available</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {bom.lines.map((line) => {
                const batchesCanMake = line.quantity > 0 ? Math.floor(line.item.currentStock / line.quantity) : 999;
                return (
                  <tr key={line.id}>
                    <td><strong>{line.item.name}</strong></td>
                    <td>{line.quantity}</td>
                    <td>{line.unit}</td>
                    <td>{line.item.currentStock.toLocaleString()} {line.item.unit}</td>
                    <td>
                      <span className={`badge ${batchesCanMake > 10 ? "badge-green" : batchesCanMake > 3 ? "badge-orange" : "badge-red"}`}>
                        Can make {batchesCanMake} batches
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="card-header" style={{ marginTop: "1rem" }}>
            <h4 style={{ fontSize: "0.88rem" }}>Production Orders</h4>
            <NewProductionOrderButton boms={boms} />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Cost / Unit</th>
                <th>Total Cost Est.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bom.productionOrders.map((order) => (
                <tr key={order.id}>
                  <td>{new Date(order.date).toLocaleDateString("en-ZW")}</td>
                  <td><strong>{order.quantity.toLocaleString()}</strong></td>
                  <td>{bom.unit}s</td>
                  <td>{order.costPerUnit ? `$${order.costPerUnit.toFixed(4)}` : "—"}</td>
                  <td>{order.costPerUnit ? `$${(order.quantity * order.costPerUnit).toFixed(2)}` : "—"}</td>
                  <td>
                    <span className={`badge ${order.status === "Complete" ? "badge-green" : order.status === "InProgress" ? "badge-orange" : "badge-gray"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Raw materials available */}
      <div className="card">
        <div className="card-header">
          <h3>Raw Material Stock</h3>
          <button className="client-btn btn-sm">Request Restock</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Code</th>
              <th>On Hand</th>
              <th>Unit</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td><code style={{ fontSize: "0.78rem" }}>{item.itemCode}</code></td>
                <td>{item.currentStock}</td>
                <td>{item.unit}</td>
                <td>${item.unitCost.toFixed(2)}</td>
                <td>${(item.currentStock * item.unitCost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
