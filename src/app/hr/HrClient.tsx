"use client";

import React, { useState } from "react";
import { addStaffAction } from "@/app/_actions/hr";
import { logoutAction } from "@/app/_actions/auth";

type PayrollLine = {
  id: number;
  month: string;
  grossSalary: number;
  paye: number;
  nssa: number;
  netSalary: number;
};

type Staff = {
  id: number;
  name: string;
  employeeCode: string | null;
  role: string;
  employeeType: string;
  salary: number;
  costAllocation: string;
  payrollLines: PayrollLine[];
};

export default function HrClient({ staff, userName }: { staff: Staff[], userName: string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  // Add Employee Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [employeeType, setEmployeeType] = useState("Permanent");
  const [salary, setSalary] = useState("");
  const [costAllocation, setCostAllocation] = useState("Farm");
  const [loading, setLoading] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addStaffAction({ name, role, employeeType, salary: Number(salary), costAllocation });
    setShowAddModal(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Employee Directory</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage staff, roles, and view payslips</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: "#4f46e5", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            + Add Employee
          </button>
          <button onClick={() => logoutAction()} style={{ backgroundColor: "#f1f5f9", color: "#334155", border: "none", padding: "0.75rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {staff.map(employee => (
          <div key={employee.id} style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }} className="staff-card">
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "bold" }}>
                {employee.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#0f172a", fontSize: "1.125rem" }}>{employee.name}</div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>{employee.role} • {employee.employeeCode}</div>
              </div>
            </div>
            
            <div style={{ padding: "1.5rem", flex: 1, backgroundColor: "#fafaf9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>Type:</span>
                <span style={{ color: "#0f172a", fontWeight: "500", backgroundColor: employee.employeeType === "Permanent" ? "#dbeafe" : "#ffedd5", padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", color: employee.employeeType === "Permanent" ? "#1e40af" : "#c2410c" }}>{employee.employeeType}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>Base Salary:</span>
                <span style={{ color: "#0f172a", fontWeight: "500" }}>${employee.salary.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "#64748b" }}>Cost Center:</span>
                <span style={{ color: "#0f172a", fontWeight: "500" }}>{employee.costAllocation}</span>
              </div>
            </div>

            <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid #f1f5f9" }}>
              <button 
                onClick={() => setSelectedStaff(employee)}
                style={{ width: "100%", backgroundColor: "transparent", color: "#4f46e5", border: "1px solid #c7d2fe", padding: "0.5rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e0e7ff"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                View Payslips
              </button>
            </div>
          </div>
        ))}

        {staff.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#64748b" }}>
            No employees found. Click "Add Employee" to get started.
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "500px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Add New Employee</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#94a3b8", cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="e.g. Tendai Shumba" />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Job Title / Role</label>
                  <input type="text" required value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="e.g. Tractor Driver" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Employee Type</label>
                  <select value={employeeType} onChange={e => setEmployeeType(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", backgroundColor: "white" }}>
                    <option>Permanent</option>
                    <option>Seasonal</option>
                    <option>Task Worker</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Base Salary ($)</label>
                  <input type="number" required value={salary} onChange={e => setSalary(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="0.00" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Cost Allocation</label>
                  <select value={costAllocation} onChange={e => setCostAllocation(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", backgroundColor: "white" }}>
                    <option>Farm Operations</option>
                    <option>Retail Shop</option>
                    <option>Manufacturing</option>
                    <option>Administration</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#4f46e5", color: "white", padding: "1rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payslips Modal */}
      {selectedStaff && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "600px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Payslips: {selectedStaff.name}</h2>
                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{selectedStaff.role} • {selectedStaff.employeeCode}</div>
              </div>
              <button onClick={() => setSelectedStaff(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#94a3b8", cursor: "pointer" }}>×</button>
            </div>
            
            <div style={{ padding: "1.5rem", maxHeight: "60vh", overflowY: "auto", backgroundColor: "#fafaf9" }}>
              {selectedStaff.payrollLines.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem", border: "1px dashed #cbd5e1", borderRadius: "8px" }}>
                  No payslips generated for this employee yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {selectedStaff.payrollLines.map(slip => (
                    <div key={slip.id} style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                        <span style={{ fontWeight: "bold", color: "#0f172a", fontSize: "1.125rem" }}>Period: {slip.month}</span>
                        <span style={{ fontSize: "0.75rem", backgroundColor: "#dcfce7", color: "#166534", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: "bold" }}>PAID</span>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#475569" }}>
                        <span>Gross Earnings</span>
                        <span>${slip.grossSalary.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#ef4444" }}>
                        <span>PAYE Tax</span>
                        <span>-${slip.paye.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.875rem", color: "#ef4444" }}>
                        <span>NSSA (Social Security)</span>
                        <span>-${slip.nssa.toFixed(2)}</span>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                        <span style={{ fontWeight: "bold", color: "#0f172a", fontSize: "1rem" }}>NET PAY</span>
                        <span style={{ fontWeight: "bold", color: "#10b981", fontSize: "1.5rem" }}>${slip.netSalary.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedStaff(null)} style={{ backgroundColor: "white", border: "1px solid #cbd5e1", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", color: "#334155" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
