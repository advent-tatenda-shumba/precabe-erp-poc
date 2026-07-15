import React from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ExportCSVButton } from "@/app/_components/ExportCSVButton";

export const dynamic = "force-dynamic";

export default async function ShrinkageDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const mockShrinkage = [
    { date: "2026-07-13", item: "Maize Seed (Pan 53)", location: "Kwekwe Main Farm", expected: 500, counted: 485, variance: -15, value: 300, status: "Investigating", id: 1 },
    { date: "2026-07-10", item: "Diesel", location: "Mazoe Farm", expected: 2500, counted: 2420, variance: -80, value: 115, status: "Written Off", id: 2 },
    { date: "2026-07-08", item: "Beef Sausages", location: "Butchery Retail", expected: 120, counted: 115, variance: -5, value: 45, status: "Written Off", id: 3 },
    { date: "2026-07-02", item: "Ammonium Nitrate", location: "Bikita Farm", expected: 1000, counted: 1000, variance: 0, value: 0, status: "Audited", id: 4 },
  ];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Shrinkage & Loss Tracking</h1>
          <p className="subtitle">Inventory Variance, Theft, and Spoilage Monitoring</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ opacity: 0.8, cursor: "not-allowed" }}>+ Log Stock Count</button>
          <ExportCSVButton 
            headers={["Date", "Item", "Location", "Expected", "Counted", "Variance", "Loss Value ($)", "Status"]}
            rows={mockShrinkage.map(s => [s.date, s.item, s.location, s.expected, s.counted, s.variance, s.value, s.status])}
            filename="shrinkage_report"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ borderLeft: "4px solid var(--danger)", background: "linear-gradient(to right, #fdf2f8, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>MTD Total Shrinkage Value</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--danger)", margin: "0.5rem 0" }}>$460.00</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>0.4% of total inventory value</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--warning)", background: "linear-gradient(to right, #fffbeb, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Unresolved Variances</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)", margin: "0.5rem 0" }}>1 Alert</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Requires manager review</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--primary)", background: "linear-gradient(to right, #f0fdf4, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Audits Completed</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", margin: "0.5rem 0" }}>4 This Month</div>
          <div style={{ color: "var(--success)", fontSize: "0.875rem", fontWeight: "bold" }}>On schedule</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Stock Counts & Variances</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Location</th>
                <th style={{ textAlign: "right" }}>System Qty</th>
                <th style={{ textAlign: "right" }}>Physical Count</th>
                <th style={{ textAlign: "right" }}>Variance</th>
                <th style={{ textAlign: "right" }}>Loss Value (USD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockShrinkage.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td><strong>{item.item}</strong></td>
                  <td><span className="farm-tag">{item.location.split(" ")[0]}</span></td>
                  <td style={{ textAlign: "right" }}>{item.expected}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>{item.counted}</td>
                  <td style={{ textAlign: "right", color: item.variance < 0 ? "var(--danger)" : "inherit", fontWeight: "bold" }}>
                    {item.variance < 0 ? item.variance : "-"}
                  </td>
                  <td style={{ textAlign: "right", color: item.value > 0 ? "var(--danger)" : "inherit" }}>
                    ${item.value.toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${item.status === 'Investigating' ? 'badge-orange' : item.status === 'Audited' ? 'badge-green' : 'badge-red'}`}>
                      {item.status}
                    </span>
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
