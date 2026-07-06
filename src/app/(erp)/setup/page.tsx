import { prisma } from "@/lib/prisma";
import { AddFarmButton, AddAccountButton } from "./SetupForms";

export const dynamic = "force-dynamic";

export default async function Setup() {
  const [farms, budgets, loans, bankAccounts] = await Promise.all([
    prisma.farm.findMany({ include: { staff: true, crops: true } }),
    prisma.budget.findMany({ where: { year: 2026 }, include: { farm: true } }),
    prisma.interFarmLoan.findMany({ include: { lenderFarm: true, borrowerFarm: true } }),
    prisma.bankAccount.findMany({ include: { farm: true } }),
  ]);

  const totalBudget = budgets.reduce((a, b) => a + b.budgetAmount, 0);
  const totalCash = bankAccounts.reduce((a, b) => a + b.balance, 0);

  return (
    <div>
      <div className="page-header">
        <h2>Setup & Configuration</h2>
        <p>System-wide settings — currency rates, PAYE brackets, farms, roles, and bank accounts.</p>
      </div>

      {/* Currency Rates */}
      <div className="card">
        <div className="card-header">
          <h3> Currency Exchange Rates</h3>
          <button className="btn btn-sm">Force Sync Rates</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Currency Pair</th><th>Rate</th><th>Direction</th><th>Last Updated</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>USD → ZIG</strong></td>
              <td><strong>13.56</strong></td>
              <td>1 USD = 13.56 ZIG</td>
              <td><span className="badge badge-green">Auto (Today)</span></td>
            </tr>
            <tr>
              <td><strong>USD → ZAR</strong></td>
              <td><strong>18.42</strong></td>
              <td>1 USD = 18.42 ZAR</td>
              <td><span className="badge badge-green">Auto (Today)</span></td>
            </tr>
            <tr>
              <td><strong>USD → GBP</strong></td>
              <td><strong>0.787</strong></td>
              <td>1 USD = 0.787 GBP</td>
              <td><span className="badge badge-green">Auto (Today)</span></td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--input-bg)", borderRadius: 8, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
           All transactions are stored in USD. ZIG and ZAR equivalents are shown for reference using the rates above.
        </div>
      </div>

      {/* Farm Overview */}
      <div className="card">
        <div className="card-header">
          <h3> Farm & Location Management</h3>
          <AddFarmButton />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Farm Name</th>
                <th>Location</th>
                <th>Description</th>
                <th>Staff</th>
                <th>Crop Fields</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.location}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{f.description ?? "—"}</td>
                  <td>{f.staff.length}</td>
                  <td>{f.crops.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="card">
        <div className="card-header">
          <h3> Bank Accounts</h3>
          <AddAccountButton farms={farms} />
        </div>
        <table className="table">
          <thead>
            <tr><th>Farm</th><th>Bank</th><th>Account Number</th><th>Currency</th><th>Balance (USD)</th></tr>
          </thead>
          <tbody>
            {bankAccounts.map((a) => (
              <tr key={a.id}>
                <td><span className="farm-tag">{a.farm.name.split(" ")[0]}</span></td>
                <td>{a.bankName}</td>
                <td><code style={{ fontSize: "0.78rem" }}>{a.accountNumber}</code></td>
                <td>{a.currency}</td>
                <td><strong>${a.balance.toLocaleString()}</strong></td>
              </tr>
            ))}
            <tr style={{ fontWeight: 800 }}>
              <td colSpan={4} style={{ textAlign: "right" }}>Total Cash Position</td>
              <td style={{ color: "var(--success)" }}>${totalCash.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Budget Overview */}
      <div className="card">
        <div className="card-header">
          <h3> 2026 Budget Summary</h3>
          <button className="client-btn btn-sm">Edit Budgets</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ background: "var(--accent-light)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-color)", marginBottom: "0.4rem" }}>TOTAL BUDGET</div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>${(totalBudget / 1000).toFixed(0)}k</div>
          </div>
          {[...new Set(budgets.map(b => b.category))].map(cat => {
            const catTotal = budgets.filter(b => b.category === cat).reduce((a, b) => a + b.budgetAmount, 0);
            return (
              <div key={cat} style={{ border: "1px solid var(--border-color)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>{cat.toUpperCase()}</div>
                <div style={{ fontWeight: 700 }}>${(catTotal / 1000).toFixed(0)}k</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Roles */}
      <div className="card">
        <div className="card-header">
          <h3> User Roles & Permissions</h3>
          <button className="client-btn btn-sm">Manage Roles</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Role</th><th>Access Level</th><th>Description</th></tr>
          </thead>
          <tbody>
            {[
              { role: "Super Admin", level: "Full Access", desc: "Full system access including all farms, financial data, and configuration" },
              { role: "Finance Officer", level: "Finance Only", desc: "GL, cost accounting, payroll, and financial reports" },
              { role: "Farm Manager", level: "Operational", desc: "Agriculture, livestock, inventory, and cost entry for assigned farm" },
              { role: "HR Officer", level: "HR Only", desc: "Payroll processing and employee management" },
              { role: "POS Cashier", level: "POS Only", desc: "Sales entry and cash reconciliation for assigned outlet" },
              { role: "Procurement Officer", level: "Purchasing", desc: "Purchase orders and supplier management" },
            ].map((r) => (
              <tr key={r.role}>
                <td><strong>{r.role}</strong></td>
                <td><span className="badge badge-purple">{r.level}</span></td>
                <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System info */}
      <div className="card">
        <div className="card-header"><h3>️ System Information</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
          {[
            ["ERP Name", "Wisdom ERP"],
            ["Client", "Pricabe Enterprises (Pvt) Ltd"],
            ["Country", "Zimbabwe"],
            ["Base Currency", "USD (United States Dollar)"],
            ["Payroll Compliance", "ZIMRA PAYE + NSSA"],
            ["Version", "POC v1.0 — 2026"],
            ["Deployment", "Self-hosted / On-premise"],
            ["Database", "SQLite (dev) → PostgreSQL (prod)"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.72rem" }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
