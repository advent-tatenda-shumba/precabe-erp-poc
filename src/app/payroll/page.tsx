import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function Payroll() {
  const staff = await prisma.staff.findMany({
    include: { farm: true },
  });

  return (
    <div>
      <div className="page-header">
        <h2>Payroll & HR</h2>
        <p>Run payroll and allocate labor costs automatically to farm dimensions.</p>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3>Current Staff Roster</h3>
          <button className="btn">Run Monthly Payroll</button>
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Base Salary</th>
              <th>Assigned Farm</th>
              <th>Cost Allocation Strategy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(emp => (
              <tr key={emp.id}>
                <td><strong>{emp.name}</strong></td>
                <td>{emp.role}</td>
                <td>${emp.salary.toFixed(2)}</td>
                <td><span className="module-title">{emp.farm.name}</span></td>
                <td><span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>100% Shared Overhead (Farm Level)</span></td>
                <td><button className="client-btn" style={{padding: '0.25rem 0.75rem'}}>Edit Allocation</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Zimbabwe statutory deductions (PAYE / NSSA) Config</h3>
        <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '10px'}}>
          The system is currently configured to calculate NSSA at 4.5% up to the insurable earnings ceiling. PAYE brackets are loaded via the Setup module.
        </p>
      </div>
    </div>
  );
}
