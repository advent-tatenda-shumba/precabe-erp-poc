import { prisma } from "@/lib/prisma";
import { NewPOButton, ApprovePOButton } from "./PurchasingForms";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { cls: string; label: string }> = {
  Draft:          { cls: "badge-gray",   label: "Draft" },
  PendingApproval:{ cls: "badge-orange", label: "Pending Approval" },
  Approved:       { cls: "badge-blue",   label: "Approved" },
  InTransit:      { cls: "badge-purple", label: "In Transit" },
  Delivered:      { cls: "badge-green",  label: "Delivered" },
  Cancelled:      { cls: "badge-red",    label: "Cancelled" },
};

export default async function Purchasing() {
  const [pos, contacts, farms] = await Promise.all([
    prisma.purchaseOrder.findMany({
      include: { contact: true, farm: true, lines: true },
      orderBy: { date: "desc" },
    }),
    prisma.contact.findMany({ where: { contactType: { in: ["Supplier"] } }, orderBy: { name: "asc" } }),
    prisma.farm.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalValue = pos.reduce((a, p) => a + p.totalAmount, 0);
  const pending = pos.filter((p) => p.status === "PendingApproval");
  const inTransit = pos.filter((p) => p.status === "InTransit");

  return (
    <div>
      <div className="page-header">
        <h2>Purchasing</h2>
        <p>Manage supplier purchase orders, approvals, and delivery tracking.</p>
      </div>

      {/* Summary */}
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total POs</div>
          <div className="stat-value">{pos.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total Value</div>
          <div className="stat-value">${(totalValue / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value" style={{ color: pending.length > 0 ? "var(--warning)" : "inherit" }}>{pending.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">In Transit</div>
          <div className="stat-value" style={{ color: "var(--info)" }}>{inTransit.length}</div>
        </div>
      </div>

      {/* Alerts */}
      {pending.length > 0 && (
        <div className="alert alert-warning">
          ⚠️ <strong>{pending.length} PO{pending.length > 1 ? "s" : ""}</strong> require approval before goods can be dispatched.
        </div>
      )}

      {/* PO Table */}
      <div className="card">
        <div className="card-header">
          <h3>Purchase Orders</h3>
          <NewPOButton contacts={contacts} farms={farms} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Farm</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (USD)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => {
                const cfg = statusConfig[po.status] ?? { cls: "badge-gray", label: po.status };
                return (
                  <tr key={po.id}>
                    <td><strong>{po.poNumber}</strong></td>
                    <td>{po.contact.name}</td>
                    <td><span className="farm-tag">{po.farm.name.split(" ")[0]}</span></td>
                    <td>{new Date(po.date).toLocaleDateString("en-ZW")}</td>
                    <td>{po.lines.length} line{po.lines.length !== 1 ? "s" : ""}</td>
                    <td><strong>${po.totalAmount.toLocaleString()}</strong></td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                    <td>
                      {po.status === "PendingApproval" && (
                        <ApprovePOButton poId={po.id} />
                      )}
                      {po.status === "Draft" && (
                        <button className="client-btn btn-sm">Submit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Line Details */}
      {pos.filter(p => p.status !== "Delivered" && p.status !== "Cancelled").map(po => (
        <div key={po.id} className="card">
          <div className="card-header">
            <h3>{po.poNumber} — {po.contact.name}</h3>
            <span className={`badge ${(statusConfig[po.status] ?? { cls: "badge-gray" }).cls}`}>
              {(statusConfig[po.status] ?? { label: po.status }).label}
            </span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {po.lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.description}</td>
                  <td>{line.quantity}</td>
                  <td>${line.unitPrice.toFixed(2)}</td>
                  <td><strong>${line.totalPrice.toLocaleString()}</strong></td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                <td><strong>${po.totalAmount.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
