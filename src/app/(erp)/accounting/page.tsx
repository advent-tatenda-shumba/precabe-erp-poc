import React from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ExportCSVButton } from "@/app/_components/ExportCSVButton";

export const dynamic = "force-dynamic";

export default async function AccountingDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h1>Financial Accounting (GL)</h1>
          <p className="subtitle">Consolidated Ledger & Financial Dashboards (Preview Phase 3)</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ opacity: 0.8, cursor: "not-allowed" }}>Run EOM Close</button>
          <ExportCSVButton 
            headers={["Account", "Debit", "Credit"]}
            rows={[
              ["1010 - Bank (CABS)", "18500", "0"],
              ["2010 - Accounts Payable", "0", "12900"]
            ]}
            filename="trial_balance"
            label="Export Trial Balance"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ borderLeft: "4px solid var(--primary)", background: "linear-gradient(to right, #f8fafc, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>YTD Gross Revenue</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0" }}>$428,500.00</div>
          <div style={{ color: "var(--success)", fontSize: "0.875rem", fontWeight: "bold" }}>↑ 12% vs Last Year</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--danger)", background: "linear-gradient(to right, #f8fafc, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>YTD Total Expenses</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0" }}>$291,240.50</div>
          <div style={{ color: "var(--danger)", fontSize: "0.875rem", fontWeight: "bold" }}>↑ 5% vs Last Year</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--success)", background: "linear-gradient(to right, #f8fafc, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>YTD Net Profit</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--success)", margin: "0.5rem 0" }}>$137,259.50</div>
          <div style={{ color: "var(--success)", fontSize: "0.875rem", fontWeight: "bold" }}>↑ 31% Profit Margin</div>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--warning)", background: "linear-gradient(to right, #f8fafc, white)" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Inter-Farm Funding Balance</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0" }}>$45,000.00</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Owed by Branch Farms</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        {/* General Ledger Preview */}
        <div className="card">
          <div className="card-header">
            <h3>General Ledger (Recent Postings)</h3>
            <span className="badge badge-gray">Real-time</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Debit (DR)</th>
                  <th style={{ textAlign: "right" }}>Credit (CR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-07-14</td>
                  <td><strong>1010 - Bank (CABS)</strong></td>
                  <td>Customer Payment (Inv #1042)</td>
                  <td style={{ textAlign: "right", color: "var(--success)" }}>$4,500.00</td>
                  <td style={{ textAlign: "right" }}>-</td>
                </tr>
                <tr>
                  <td>2026-07-14</td>
                  <td><strong>4010 - Sales (Beef)</strong></td>
                  <td>Customer Payment (Inv #1042)</td>
                  <td style={{ textAlign: "right" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$4,500.00</td>
                </tr>
                <tr>
                  <td>2026-07-13</td>
                  <td><strong>5020 - Fuel Expense</strong></td>
                  <td>Diesel Delivery (5000L)</td>
                  <td style={{ textAlign: "right", color: "var(--success)" }}>$7,200.00</td>
                  <td style={{ textAlign: "right" }}>-</td>
                </tr>
                <tr>
                  <td>2026-07-13</td>
                  <td><strong>2010 - Accounts Payable</strong></td>
                  <td>Zuva Petroleum</td>
                  <td style={{ textAlign: "right" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$7,200.00</td>
                </tr>
                <tr>
                  <td>2026-07-12</td>
                  <td><strong>1200 - Inter-farm Loan</strong></td>
                  <td>Transfer to Mazoe (Seed Cash)</td>
                  <td style={{ textAlign: "right", color: "var(--success)" }}>$2,500.00</td>
                  <td style={{ textAlign: "right" }}>-</td>
                </tr>
                <tr>
                  <td>2026-07-12</td>
                  <td><strong>1010 - Bank (CABS)</strong></td>
                  <td>Transfer to Mazoe (Seed Cash)</td>
                  <td style={{ textAlign: "right" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$2,500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ padding: "1rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
            <a href="/accounting/ledger" style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>View Full Ledger &rarr;</a>
          </div>
        </div>

        {/* AP / AR Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card">
            <div className="card-header">
              <h3>Accounts Receivable (AR)</h3>
            </div>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--success)", marginBottom: "0.5rem" }}>$18,450.00</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Total Outstanding Invoices</div>
              
              <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span>Current (0-30 days)</span>
                  <span style={{ fontWeight: "bold" }}>$15,000.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span>Overdue (31-60 days)</span>
                  <span style={{ fontWeight: "bold", color: "var(--warning)" }}>$2,450.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span>Critical (60+ days)</span>
                  <span style={{ fontWeight: "bold", color: "var(--danger)" }}>$1,000.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Accounts Payable (AP)</h3>
            </div>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--danger)", marginBottom: "0.5rem" }}>$12,900.00</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Total Unpaid Bills</div>
              
              <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span>Zuva Petroleum</span>
                  <span style={{ fontWeight: "bold" }}>$7,200.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  <span>Agricura (Chemicals)</span>
                  <span style={{ fontWeight: "bold" }}>$4,500.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span>ZESA (Electricity)</span>
                  <span style={{ fontWeight: "bold" }}>$1,200.00</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
