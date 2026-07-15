import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HRM() {
  const [staff, farms] = await Promise.all([
    prisma.staff.findMany({
      where: { status: "Active" },
      include: { farm: true },
      orderBy: [{ farmId: "asc" }, { name: "asc" }],
    }),
    prisma.farm.findMany({ orderBy: { name: "asc" } }),
  ]);

  const byFarm = farms.map((f) => ({
    farm: f,
    employees: staff.filter((s) => s.farmId === f.id),
  })).filter((g) => g.employees.length > 0);

  const roles = [...new Set(staff.map((s) => s.role))].sort();
  const roleCount = roles.map((r) => ({ role: r, count: staff.filter((s) => s.role === r).length }));

  return (
    <div>
      <div className="page-header">
        <h2>Human Resource Management</h2>
        <p>Employee directory, roles, and workforce structure across all farms.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{staff.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Permanent</div>
          <div className="stat-value">{staff.filter((s) => s.employeeType === "Permanent").length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Contract</div>
          <div className="stat-value">{staff.filter((s) => s.employeeType === "Contract").length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Farms</div>
          <div className="stat-value">{byFarm.length}</div>
        </div>
      </div>

      {/* Role breakdown */}
      <div className="card">
        <div className="card-header"><h3>Roles & Headcount</h3></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {roleCount.map((r) => (
            <div key={r.role} style={{ background: "var(--accent-light)", borderRadius: 8, padding: "0.4rem 0.85rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent-color)" }}>{r.role}</span>
              <span style={{ background: "var(--accent-color)", color: "white", borderRadius: 99, padding: "0 0.4rem", fontSize: "0.72rem", fontWeight: 700 }}>{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-farm employee lists */}
      {byFarm.map(({ farm, employees }) => (
        <div key={farm.id} className="card">
          <div className="card-header">
            <h3>{farm.name} <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 400 }}>({farm.location})</span></h3>
            <span className="badge badge-blue">{employees.length} employees</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Monthly Salary</th>
                  <th>Cost Allocation</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td><code style={{ fontSize: "0.78rem" }}>{emp.employeeCode ?? "—"}</code></td>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.role}</td>
                    <td>
                      <span className={`badge ${emp.employeeType === "Permanent" ? "badge-green" : "badge-orange"}`}>
                        {emp.employeeType}
                      </span>
                    </td>
                    <td>${emp.salary.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-purple">{emp.costAllocation}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
