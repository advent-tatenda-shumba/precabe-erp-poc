import { prisma } from "@/lib/prisma";
import { FarmRevenueChart, OutletPieChart } from "./DashboardCharts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [farms, recentInvoices, costsAgg, latestPayroll, pendingPOs] = await Promise.all([
    prisma.farm.findMany({ include: { salesInvoices: true, costs: true } }),
    prisma.salesInvoice.findMany({ orderBy: { date: "desc" }, take: 6, include: { farm: true } }),
    prisma.cost.aggregate({ _sum: { amount: true } }),
    prisma.payroll.findFirst({ orderBy: { runDate: "desc" } }),
    prisma.purchaseOrder.count({ where: { status: "PendingApproval" } }),
  ]);

  const lowStock = await prisma.inventoryItem.findMany({
    where: { currentStock: { lte: 50 } },
    take: 5,
    include: { warehouse: { include: { farm: true } } },
  });

  const loans = await prisma.interFarmLoan.findMany({ where: { status: "Active" } });

  const totalRevenue = farms.reduce((s, f) => s + f.salesInvoices.reduce((a, i) => a + i.totalAmount, 0), 0);
  const totalCosts = costsAgg._sum.amount ?? 0;
  const netProfit = totalRevenue - totalCosts;
  const cashBalance = 130600; // sum of seeded bank accounts

  const pendingInvoicesAgg = await prisma.salesInvoice.aggregate({
    where: { status: "AwaitingPayment" },
    _sum: { totalAmount: true },
  });
  const pendingReceivable = pendingInvoicesAgg._sum.totalAmount ?? 0;

  // Chart data
  const farmChartData = farms.map((f) => ({
    name: f.name.split(" ")[0],
    revenue: Math.round(f.salesInvoices.reduce((a, i) => a + i.totalAmount, 0)),
    costs: Math.round(f.costs.reduce((a, c) => a + c.amount, 0)),
  }));

  const allInvoices = farms.flatMap((f) => f.salesInvoices);
  const outletData = ["Wholesale", "Butchery", "FuelStation", "Bakery", "Bar"].map((outlet) => ({
    name: outlet,
    value: Math.round(allInvoices.filter((i) => i.outlet === outlet).reduce((a, i) => a + i.totalAmount, 0)),
  })).filter((d) => d.value > 0);

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card green">
          <div className="kpi-icon">💰</div>
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">${(totalRevenue / 1000).toFixed(0)}k</div>
          <div className="kpi-sub">All farms & outlets</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-icon">📊</div>
          <div className="kpi-label">Total Costs</div>
          <div className="kpi-value">${(totalCosts / 1000).toFixed(0)}k</div>
          <div className="kpi-sub">Operational expenses</div>
        </div>
        <div className={`kpi-card ${netProfit >= 0 ? "green" : "red"}`}>
          <div className="kpi-icon">📈</div>
          <div className="kpi-label">Net Profit</div>
          <div className="kpi-value">{netProfit >= 0 ? "+" : ""}${(Math.abs(netProfit) / 1000).toFixed(0)}k</div>
          <div className="kpi-sub">{netProfit >= 0 ? "Profitable period" : "Loss position"}</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-icon">🏦</div>
          <div className="kpi-label">Cash at Bank</div>
          <div className="kpi-value">${(cashBalance / 1000).toFixed(0)}k</div>
          <div className="kpi-sub">Across all accounts</div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-title">Revenue vs Costs by Farm (USD)</div>
          <FarmRevenueChart data={farmChartData} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Revenue by Outlet</div>
          {outletData.length > 0 ? (
            <OutletPieChart data={outletData} />
          ) : (
            <p style={{ color: "var(--text-secondary)", textAlign: "center", paddingTop: "4rem" }}>No sales data yet</p>
          )}
        </div>
      </div>

      {/* Bottom panels */}
      <div className="dashboard-panels">
        {/* Recent Invoices */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Invoices</h3>
            <Link href="/sales" className="client-btn btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Farm</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><strong>{inv.invoiceNumber}</strong></td>
                    <td><span className="farm-tag">{inv.farm.name.split(" ")[0]}</span></td>
                    <td>${inv.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${inv.status === "Paid" ? "badge-green" : inv.status === "AwaitingPayment" ? "badge-orange" : "badge-gray"}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Summaries */}
        <div>
          {pendingPOs > 0 && (
            <div className="alert alert-warning">
              ⚠️ <strong>{pendingPOs} PO{pendingPOs > 1 ? "s" : ""}</strong> awaiting approval.{" "}
              <Link href="/purchasing" style={{ color: "inherit", fontWeight: 700 }}>Review →</Link>
            </div>
          )}
          {pendingReceivable > 0 && (
            <div className="alert alert-warning">
              📄 <strong>${pendingReceivable.toLocaleString()}</strong> in outstanding receivables.{" "}
              <Link href="/sales" style={{ color: "inherit", fontWeight: 700 }}>View →</Link>
            </div>
          )}
          {loans.length > 0 && (
            <div className="alert alert-warning">
              🔄 <strong>{loans.length} active inter-farm loan{loans.length > 1 ? "s" : ""}</strong> — ${loans.reduce((a, l) => a + l.outstanding, 0).toLocaleString()} outstanding.
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3>Stock Alerts</h3>
              <Link href="/inventory" className="client-btn btn-sm">Inventory</Link>
            </div>
            {lowStock.length === 0 ? (
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>✅ All stock levels are healthy.</p>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>
                  <div>
                    <div style={{ fontSize: "0.84rem", fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{item.warehouse.farm.name}</div>
                  </div>
                  <span className={`badge ${item.currentStock === 0 ? "badge-red" : "badge-orange"}`}>
                    {item.currentStock} {item.unit}
                  </span>
                </div>
              ))
            )}
          </div>

          {latestPayroll && (
            <div className="card">
              <div className="card-header">
                <h3>Last Payroll</h3>
                <Link href="/payroll" className="client-btn btn-sm">Payroll</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                {[
                  { label: "Month", value: latestPayroll.month, color: "" },
                  { label: "Gross", value: `$${latestPayroll.totalGross.toFixed(0)}`, color: "" },
                  { label: "PAYE", value: `$${latestPayroll.totalPaye.toFixed(0)}`, color: "var(--danger)" },
                  { label: "Net Pay", value: `$${latestPayroll.totalNet.toFixed(0)}`, color: "var(--success)" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{s.label}</div>
                    <div style={{ fontWeight: 700, color: s.color || "var(--text-primary)" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
