import React from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ExportCSVButton } from "@/app/_components/ExportCSVButton";

export const dynamic = "force-dynamic";

export default async function POSReconciliationDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const mockTills = [
    { date: "2026-07-14", outlet: "Retail Shop", tillId: "TILL-01", cashier: "John Doe", systemExpected: 450.50, actualCounted: 450.50, variance: 0, status: "Reconciled" },
    { date: "2026-07-14", outlet: "Butchery", tillId: "TILL-02", cashier: "Jane Smith", systemExpected: 1240.00, actualCounted: 1235.00, variance: -5.00, status: "Short" },
    { date: "2026-07-14", outlet: "Bar Operations", tillId: "TILL-03", cashier: "Mike Johnson", systemExpected: 890.25, actualCounted: 895.25, variance: 5.00, status: "Over" },
    { date: "2026-07-14", outlet: "Fuel Station", tillId: "TILL-04", cashier: "Sarah Connor", systemExpected: 3500.00, actualCounted: 0, variance: 0, status: "Pending Count" },
  ];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Daily Till Reconciliation</h1>
          <p className="subtitle">POS Cash Drawer Management & End of Day Z-Reads</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ opacity: 0.8, cursor: "not-allowed" }}>+ Perform Z-Read</button>
          <ExportCSVButton 
            headers={["Date", "Outlet", "Till ID", "Cashier", "System Expected", "Actual Counted", "Variance", "Status"]}
            rows={mockTills.map(t => [t.date, t.outlet, t.tillId, t.cashier, t.systemExpected, t.actualCounted, t.variance, t.status])}
            filename="till_reconciliation"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ borderLeft: "4px solid var(--primary)", background: "linear-gradient(to right, #f8fafc, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Total Expected Cash (Today)</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0" }}>$6,080.75</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Across 4 active tills</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--success)", background: "linear-gradient(to right, #f0fdf4, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Successfully Reconciled</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--success)", margin: "0.5rem 0" }}>1 Till</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Ready for bank deposit</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--danger)", background: "linear-gradient(to right, #fdf2f8, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Total Cash Variance</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--danger)", margin: "0.5rem 0" }}>-$5.00</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Net difference (Short/Over)</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>End of Day Cash Drawer Counts</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Outlet</th>
                <th>Till / Cashier</th>
                <th style={{ textAlign: "right" }}>System Expected</th>
                <th style={{ textAlign: "right" }}>Actual Counted</th>
                <th style={{ textAlign: "right" }}>Variance</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTills.map((till) => (
                <tr key={till.tillId}>
                  <td>{till.date}</td>
                  <td><strong>{till.outlet}</strong></td>
                  <td>
                    <div style={{ fontWeight: "bold" }}>{till.tillId}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{till.cashier}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>${till.systemExpected.toFixed(2)}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {till.actualCounted > 0 ? `$${till.actualCounted.toFixed(2)}` : "—"}
                  </td>
                  <td style={{ textAlign: "right", color: till.variance < 0 ? "var(--danger)" : till.variance > 0 ? "var(--success)" : "inherit", fontWeight: "bold" }}>
                    {till.variance !== 0 ? (till.variance > 0 ? `+$${till.variance.toFixed(2)}` : `-$${Math.abs(till.variance).toFixed(2)}`) : "-"}
                  </td>
                  <td>
                    <span className={`badge ${till.status === 'Reconciled' ? 'badge-green' : till.status === 'Pending Count' ? 'badge-gray' : till.status === 'Over' ? 'badge-blue' : 'badge-red'}`}>
                      {till.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {till.status === "Pending Count" ? (
                      <button className="client-btn btn-sm" style={{ border: "1px solid var(--primary)", color: "var(--primary)", background: "transparent" }}>Count Till</button>
                    ) : (
                      <button className="client-btn btn-sm" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "transparent" }}>View Z-Read</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
