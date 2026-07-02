import { prisma } from "@/lib/prisma";
import { RunPayrollButton } from "./PayrollForms";

export const dynamic = "force-dynamic";

// Zimbabwe PAYE calculation (USD, simplified 2024/25 brackets)
function calcPAYE(gross: number): number {
  if (gross <= 100) return 0;
  if (gross <= 300) return (gross - 100) * 0.20;
  if (gross <= 700) return 40 + (gross - 300) * 0.25;
  if (gross <= 1000) return 140 + (gross - 700) * 0.30;
  return 230 + (gross - 1000) * 0.35;
}

export default async function Payroll() {
  const [staff, payrolls] = await Promise.all([
    prisma.staff.findMany({
      include: { farm: true },
      orderBy: [{ farmId: "asc" }, { name: "asc" }],
    }),
    prisma.payroll.findMany({
      include: { lines: { include: { staff: { include: { farm: true } } } } },
      orderBy: { runDate: "desc" },
      take: 3,
    }),
  ]);

  const permanentStaff = staff.filter((s) => s.employeeType === "Permanent");
  const contractStaff = staff.filter((s) => s.employeeType !== "Permanent");
  const totalPayroll = staff.reduce((a, s) => a + s.salary, 0);

  const latestPayroll = payrolls[0];

  return (
    <div>
      <div className="page-header">
        <h2>Payroll & HR</h2>
        <p>Process payroll with Zimbabwe PAYE/NSSA compliance and allocate labour costs to farm dimensions.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{staff.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Permanent</div>
          <div className="stat-value">{permanentStaff.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Contract</div>
          <div className="stat-value">{contractStaff.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Monthly Gross</div>
          <div className="stat-value">${totalPayroll.toFixed(0)}</div>
        </div>
      </div>

      {/* Latest payroll summary */}
      {latestPayroll && (
        <div className="card">
          <div className="card-header">
            <h3>Latest Payroll — {latestPayroll.month}</h3>
            <RunPayrollButton />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            {[
              { label: "Gross Payroll", value: `$${latestPayroll.totalGross.toFixed(0)}`, color: "" },
              { label: "PAYE Withheld", value: `$${latestPayroll.totalPaye.toFixed(0)}`, color: "var(--danger)" },
              { label: "NSSA (4.5%)", value: `$${latestPayroll.totalNssa.toFixed(0)}`, color: "var(--warning)" },
              { label: "Net Pay", value: `$${latestPayroll.totalNet.toFixed(0)}`, color: "var(--success)" },
            ].map((s) => (
              <div key={s.label} style={{ border: "1px solid var(--border-color)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>{s.label}</div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: s.color || "var(--text-primary)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Per-farm breakdown */}
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>Per-Farm Payroll Allocation</h4>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Farm</th>
                  <th>Employees</th>
                  <th>Gross (USD)</th>
                  <th>PAYE</th>
                  <th>NSSA</th>
                  <th>Net Pay</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const farmMap: Record<string, { name: string; count: number; gross: number; paye: number; nssa: number; net: number }> = {};
                  for (const line of latestPayroll.lines) {
                    const fn = line.staff.farm.name;
                    if (!farmMap[fn]) farmMap[fn] = { name: fn, count: 0, gross: 0, paye: 0, nssa: 0, net: 0 };
                    farmMap[fn].count++;
                    farmMap[fn].gross += line.grossSalary;
                    farmMap[fn].paye += line.paye;
                    farmMap[fn].nssa += line.nssa;
                    farmMap[fn].net += line.netSalary;
                  }
                  return Object.values(farmMap).map((f) => (
                    <tr key={f.name}>
                      <td><span className="farm-tag">{f.name.split(" ")[0]}</span></td>
                      <td>{f.count}</td>
                      <td>${f.gross.toFixed(0)}</td>
                      <td style={{ color: "var(--danger)" }}>${f.paye.toFixed(0)}</td>
                      <td style={{ color: "var(--warning)" }}>${f.nssa.toFixed(0)}</td>
                      <td style={{ color: "var(--success)" }}><strong>${f.net.toFixed(0)}</strong></td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Roster */}
      <div className="card">
        <div className="card-header">
          <h3>Staff Roster</h3>
          <button className="client-btn btn-sm">Export Payslips</button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Type</th>
                <th>Farm</th>
                <th>Gross (USD)</th>
                <th>PAYE Est.</th>
                <th>NSSA Est.</th>
                <th>Net Est.</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((emp) => {
                const paye = calcPAYE(emp.salary);
                const nssa = Math.min(emp.salary * 0.045, 57.33);
                const net = emp.salary - paye - nssa;
                return (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.role}</td>
                    <td>
                      <span className={`badge ${emp.employeeType === "Permanent" ? "badge-green" : "badge-orange"}`}>
                        {emp.employeeType}
                      </span>
                    </td>
                    <td><span className="farm-tag">{emp.farm.name.split(" ")[0]}</span></td>
                    <td>${emp.salary.toFixed(2)}</td>
                    <td style={{ color: "var(--danger)" }}>${paye.toFixed(2)}</td>
                    <td style={{ color: "var(--warning)" }}>${nssa.toFixed(2)}</td>
                    <td style={{ color: "var(--success)" }}><strong>${net.toFixed(2)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory info */}
      <div className="card">
        <div className="card-header">
          <h3>Zimbabwe Statutory Compliance</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <h4 style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>PAYE Tax Brackets (USD)</h4>
            <table className="table">
              <thead>
                <tr><th>Income Band</th><th>Rate</th></tr>
              </thead>
              <tbody>
                <tr><td>$0 – $100</td><td>0%</td></tr>
                <tr><td>$101 – $300</td><td>20%</td></tr>
                <tr><td>$301 – $700</td><td>25%</td></tr>
                <tr><td>$701 – $1,000</td><td>30%</td></tr>
                <tr><td>Over $1,000</td><td>35%</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4 style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>NSSA Contributions</h4>
            <table className="table">
              <tbody>
                <tr><td>Employee Contribution</td><td><strong>4.5%</strong></td></tr>
                <tr><td>Employer Contribution</td><td><strong>4.5%</strong></td></tr>
                <tr><td>Insurable Earnings Ceiling</td><td><strong>$1,274</strong></td></tr>
                <tr><td>Max Monthly Contribution</td><td><strong>$57.33</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payroll history */}
      <div className="card">
        <div className="card-header">
          <h3>Payroll History</h3>
        </div>
        <table className="table">
          <thead>
            <tr><th>Month</th><th>Gross</th><th>PAYE</th><th>NSSA</th><th>Net</th><th>Run Date</th></tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.month}</strong></td>
                <td>${p.totalGross.toFixed(0)}</td>
                <td style={{ color: "var(--danger)" }}>${p.totalPaye.toFixed(0)}</td>
                <td style={{ color: "var(--warning)" }}>${p.totalNssa.toFixed(0)}</td>
                <td style={{ color: "var(--success)" }}><strong>${p.totalNet.toFixed(0)}</strong></td>
                <td>{new Date(p.runDate).toLocaleDateString("en-ZW")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
