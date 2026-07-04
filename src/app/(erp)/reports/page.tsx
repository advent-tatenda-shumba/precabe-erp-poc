import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Reports() {
  const [farms, costs, invoices, cycles, staff, budgets, loans] = await Promise.all([
    prisma.farm.findMany({ include: { salesInvoices: true, costs: true, crops: true } }),
    prisma.cost.groupBy({ by: ["category"], _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } } }),
    prisma.salesInvoice.findMany({ include: { farm: true } }),
    prisma.cropCycle.findMany({ include: { farm: true, crop: true, costs: true } }),
    prisma.staff.findMany({ include: { farm: true } }),
    prisma.budget.findMany({ include: { farm: true } }),
    prisma.interFarmLoan.findMany({ include: { lenderFarm: true, borrowerFarm: true } }),
  ]);

  // P&L per farm
  const farmPL = farms.map((f) => {
    const rev = f.salesInvoices.reduce((a, i) => a + i.totalAmount, 0);
    const cost = f.costs.reduce((a, c) => a + c.amount, 0);
    return { name: f.name, location: f.location, revenue: rev, costs: cost, profit: rev - cost, margin: rev > 0 ? ((rev - cost) / rev) * 100 : 0 };
  });

  const totalRev = farmPL.reduce((a, f) => a + f.revenue, 0);
  const totalCost = farmPL.reduce((a, f) => a + f.costs, 0);
  const totalProfit = totalRev - totalCost;

  // Labour analysis
  const labourByFarm: Record<string, number> = {};
  for (const s of staff) {
    const fn = s.farm.name;
    labourByFarm[fn] = (labourByFarm[fn] ?? 0) + s.salary;
  }

  // Budget variance
  const budgetVariance = budgets.map((b) => ({
    farm: b.farm.name.split(" ")[0],
    category: b.category,
    budget: b.budgetAmount,
    actual: b.actualAmount,
    variance: b.budgetAmount - b.actualAmount,
    pct: b.budgetAmount > 0 ? ((b.actualAmount / b.budgetAmount) * 100) : 0,
  }));

  return (
    <div>
      <div className="page-header">
        <h2>Report Overview</h2>
        <p>Financial, operational and management reports across all farms and business units.</p>
      </div>

      {/* P&L Summary */}
      <div className="card">
        <div className="card-header">
          <h3> Profit & Loss — By Farm (USD)</h3>
          <button className="client-btn btn-sm"> Export CSV</button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Location</th>
                <th>Revenue</th>
                <th>Costs</th>
                <th>Gross Profit</th>
                <th>Margin %</th>
              </tr>
            </thead>
            <tbody>
              {farmPL.map((f) => (
                <tr key={f.name}>
                  <td><strong>{f.name}</strong></td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{f.location}</td>
                  <td>${f.revenue.toLocaleString()}</td>
                  <td>${f.costs.toLocaleString()}</td>
                  <td>
                    <strong style={{ color: f.profit >= 0 ? "var(--success)" : "var(--danger)" }}>
                      {f.profit >= 0 ? "+" : ""}${f.profit.toLocaleString()}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${f.margin > 20 ? "badge-green" : f.margin > 0 ? "badge-orange" : "badge-red"}`}>
                      {f.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 800, borderTop: "2px solid var(--border-color)" }}>
                <td colSpan={2}>CONSOLIDATED TOTAL</td>
                <td>${totalRev.toLocaleString()}</td>
                <td>${totalCost.toLocaleString()}</td>
                <td style={{ color: totalProfit >= 0 ? "var(--success)" : "var(--danger)" }}>
                  {totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${totalRev > 0 && totalProfit / totalRev > 0.1 ? "badge-green" : "badge-orange"}`}>
                    {totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : "0.0"}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cost category breakdown */}
      <div className="card">
        <div className="card-header">
          <h3> Cost Breakdown by Category</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent (USD)</th>
                <th>% of Total Costs</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => {
                const amt = c._sum.amount ?? 0;
                const pct = totalCost > 0 ? (amt / totalCost) * 100 : 0;
                return (
                  <tr key={c.category}>
                    <td><strong>{c.category}</strong></td>
                    <td>${amt.toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="progress-bar-wrap" style={{ width: "80px" }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: "0.82rem" }}>{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crop profitability */}
      <div className="card">
        <div className="card-header">
          <h3> Crop Profitability Analysis</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Crop</th>
                <th>Season</th>
                <th>Hectares</th>
                <th>Yield (t)</th>
                <th>t/ha</th>
                <th>Direct Costs</th>
                <th>Cost/ha</th>
                <th>Cost/t</th>
                <th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => {
                const dirCosts = c.costs.reduce((a, x) => a + x.amount, 0);
                const yph = c.yieldTonnes && c.hectaresPlanted ? (c.yieldTonnes / c.hectaresPlanted).toFixed(2) : "—";
                const cph = c.hectaresPlanted > 0 ? (dirCosts / c.hectaresPlanted).toFixed(2) : "—";
                const cpt = c.yieldTonnes && c.yieldTonnes > 0 ? (dirCosts / c.yieldTonnes).toFixed(2) : "—";
                return (
                  <tr key={c.id}>
                    <td><span className="farm-tag">{c.farm.name.split(" ")[0]}</span></td>
                    <td><strong>{c.crop.name}</strong></td>
                    <td>{c.season}</td>
                    <td>{c.hectaresPlanted}</td>
                    <td>{c.yieldTonnes ?? "—"}</td>
                    <td>{yph}</td>
                    <td>${dirCosts.toLocaleString()}</td>
                    <td>{cph !== "—" ? `$${cph}` : "—"}</td>
                    <td>{cpt !== "—" ? `$${cpt}` : "—"}</td>
                    <td><span className={`badge ${c.stage === "Complete" ? "badge-green" : c.stage === "Harvesting" ? "badge-orange" : "badge-blue"}`}>{c.stage}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Labour analysis */}
      <div className="card">
        <div className="card-header">
          <h3> Labour Cost Analysis</h3>
        </div>
        <table className="table">
          <thead>
            <tr><th>Farm</th><th>Monthly Labour Cost</th><th>Annual Est.</th><th>% of Costs</th></tr>
          </thead>
          <tbody>
            {Object.entries(labourByFarm).map(([farm, monthly]) => {
              const annual = monthly * 12;
              const farmCosts = farms.find(f => f.name === farm)?.costs.reduce((a, c) => a + c.amount, 0) ?? 0;
              const pct = farmCosts > 0 ? ((monthly / farmCosts) * 100).toFixed(1) : "0.0";
              return (
                <tr key={farm}>
                  <td><strong>{farm.split(" ")[0]}</strong></td>
                  <td>${monthly.toFixed(0)}</td>
                  <td>${annual.toFixed(0)}</td>
                  <td>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Budget variance */}
      <div className="card">
        <div className="card-header">
          <h3> Budget vs Actual (2026)</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Variance</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {budgetVariance.slice(0, 20).map((b, i) => (
                <tr key={i}>
                  <td><span className="farm-tag">{b.farm}</span></td>
                  <td>{b.category}</td>
                  <td>${b.budget.toLocaleString()}</td>
                  <td>${b.actual.toLocaleString()}</td>
                  <td style={{ color: b.variance >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                    {b.variance >= 0 ? "+" : ""}${b.variance.toLocaleString()}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className="progress-bar-wrap" style={{ width: "60px" }}>
                        <div className={`progress-bar-fill ${b.pct > 90 ? "red" : b.pct > 70 ? "orange" : "green"}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                      </div>
                      <span style={{ fontSize: "0.8rem" }}>{b.pct.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inter-farm loans */}
      <div className="card">
        <div className="card-header">
          <h3> Inter-Farm Loan Tracker</h3>
        </div>
        <table className="table">
          <thead>
            <tr><th>Lender</th><th>Borrower</th><th>Amount</th><th>Outstanding</th><th>Purpose</th><th>Due Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id}>
                <td><span className="farm-tag">{l.lenderFarm.name.split(" ")[0]}</span></td>
                <td><span className="farm-tag">{l.borrowerFarm.name.split(" ")[0]}</span></td>
                <td>${l.amount.toLocaleString()}</td>
                <td><strong>${l.outstanding.toLocaleString()}</strong></td>
                <td style={{ fontSize: "0.82rem" }}>{l.purpose ?? "—"}</td>
                <td>{l.dueDate ? new Date(l.dueDate).toLocaleDateString("en-ZW") : "—"}</td>
                <td><span className={`badge ${l.status === "Repaid" ? "badge-green" : l.status === "Active" ? "badge-orange" : "badge-blue"}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
