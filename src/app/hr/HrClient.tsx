"use client";

import React, { useState, useMemo } from "react";
import { addStaffAction, updateStaffAction, updateStaffStatusAction } from "@/app/_actions/hr";
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
  phone: string | null;
  email: string | null;
  address: string | null;
  nextOfKin: string | null;
  status: string;
  notes: string | null;
  payrollLines: PayrollLine[];
};

export default function HrClient({ staff, userName }: { staff: Staff[], userName: string }) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  // UI Controls
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"alpha" | "salaryDesc" | "salaryAsc" | "department">("alpha");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [employeeType, setEmployeeType] = useState("Permanent");
  const [salary, setSalary] = useState("");
  const [costAllocation, setCostAllocation] = useState("Farm Operations");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // Sorting and Filtering Logic
  const processedStaff = useMemo(() => {
    return [...staff]
      .filter(employee => 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "alpha") return a.name.localeCompare(b.name);
        if (sortBy === "salaryDesc") return b.salary - a.salary;
        if (sortBy === "salaryAsc") return a.salary - b.salary;
        if (sortBy === "department") return a.costAllocation.localeCompare(b.costAllocation);
        return 0;
      });
  }, [staff, sortBy, searchQuery]);

  const openAddModal = () => {
    setEditingId(null);
    setName(""); setRole(""); setEmployeeType("Permanent"); setSalary(""); setCostAllocation("Farm Operations");
    setPhone(""); setEmail(""); setAddress(""); setNextOfKin(""); setNotes("");
    setShowFormModal(true);
  };

  const openEditModal = (employee: Staff) => {
    setEditingId(employee.id);
    setName(employee.name);
    setRole(employee.role);
    setEmployeeType(employee.employeeType);
    setSalary(employee.salary.toString());
    setCostAllocation(employee.costAllocation);
    setPhone(employee.phone || "");
    setEmail(employee.email || "");
    setAddress(employee.address || "");
    setNextOfKin(employee.nextOfKin || "");
    setNotes(employee.notes || "");
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name, role, employeeType, salary: Number(salary), costAllocation,
      phone, email, address, nextOfKin, notes
    };

    let result;
    if (editingId) {
      result = await updateStaffAction(editingId, payload);
    } else {
      result = await addStaffAction(payload);
    }
    
    if (result?.error) {
      alert("Error: " + result.error);
      setLoading(false);
      return;
    }

    setShowFormModal(false);
    setLoading(false);
    window.location.reload();
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    if (!confirm(`Are you sure you want to mark this employee as ${newStatus}?`)) return;
    
    setLoading(true);
    const result = await updateStaffStatusAction(id, newStatus);
    if (result?.error) {
      alert("Error: " + result.error);
    } else {
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#0f172a", fontWeight: "800" }}>Employee Directory</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem", marginTop: "0.25rem" }}>Manage staff profiles and view payslips</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={openAddModal}
            style={{ background: "linear-gradient(to right, #4f46e5, #6366f1)", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)" }}
          >
            + Add Employee
          </button>
          <button onClick={() => logoutAction()} style={{ backgroundColor: "#f1f5f9", color: "#334155", border: "none", padding: "0.75rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem", backgroundColor: "white", padding: "1rem 1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        
        {/* Search Bar */}
        <div style={{ display: "flex", flex: "1 1 300px" }}>
          <input 
            type="text" 
            placeholder="Search employees by name or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", fontWeight: "500", fontSize: "0.95rem" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569", fontSize: "0.875rem" }}>Sort By:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", fontWeight: "600", cursor: "pointer" }}
          >
            <option value="alpha">Alphabetical (A-Z)</option>
            <option value="salaryDesc">Highest Salary</option>
            <option value="salaryAsc">Lowest Salary</option>
            <option value="department">By Department / Farm</option>
          </select>
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#f1f5f9", padding: "0.25rem", borderRadius: "8px" }}>
          <button 
            onClick={() => setViewMode("grid")}
            style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", backgroundColor: viewMode === "grid" ? "white" : "transparent", color: viewMode === "grid" ? "#4f46e5" : "#64748b", boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}
          >
            Grid View
          </button>
          <button 
            onClick={() => setViewMode("list")}
            style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", backgroundColor: viewMode === "list" ? "white" : "transparent", color: viewMode === "list" ? "#4f46e5" : "#64748b", boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}
          >
            List View
          </button>
        </div>
      </div>

      {/* Directory Content */}
      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {processedStaff.map(employee => (
            <div key={employee.id} style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s", opacity: employee.status === "Inactive" ? 0.65 : 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} className="staff-card">
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: employee.status === "Inactive" ? "#f1f5f9" : "#e0e7ff", color: employee.status === "Inactive" ? "#94a3b8" : "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "bold" }}>
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#0f172a", fontSize: "1.125rem", textDecoration: employee.status === "Inactive" ? "line-through" : "none" }}>{employee.name}</div>
                  <div style={{ color: "#64748b", fontSize: "0.875rem" }}>{employee.role} • {employee.employeeCode}</div>
                </div>
                <span style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "0.7rem", padding: "0.25rem 0.5rem", borderRadius: "999px", fontWeight: "bold", backgroundColor: employee.status === "Active" ? "#dcfce7" : "#fee2e2", color: employee.status === "Active" ? "#166534" : "#991b1b" }}>
                  {employee.status}
                </span>
              </div>
              
              <div style={{ padding: "1.5rem", flex: 1, backgroundColor: "#fafaf9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Type:</span>
                  <span style={{ color: "#0f172a", fontWeight: "500", backgroundColor: employee.employeeType === "Permanent" ? "#dbeafe" : "#ffedd5", padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", color: employee.employeeType === "Permanent" ? "#1e40af" : "#c2410c" }}>{employee.employeeType}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Base Salary:</span>
                  <span style={{ color: "#0f172a", fontWeight: "800" }}>${employee.salary.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Department:</span>
                  <span style={{ color: "#0f172a", fontWeight: "500" }}>{employee.costAllocation}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Phone:</span>
                  <span style={{ color: "#0f172a", fontWeight: "500" }}>{employee.phone || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Email:</span>
                  <span style={{ color: "#0f172a", fontWeight: "500" }}>{employee.email || "—"}</span>
                </div>
              </div>

              <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.5rem" }}>
                <button 
                  onClick={() => setSelectedStaff(employee)}
                  style={{ flex: 1, backgroundColor: "#f8fafc", color: "#4f46e5", border: "1px solid #cbd5e1", padding: "0.5rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  Payslips
                </button>
                <button 
                  onClick={() => openEditModal(employee)}
                  style={{ flex: 1, backgroundColor: "#f8fafc", color: "#0f172a", border: "1px solid #cbd5e1", padding: "0.5rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleStatusChange(employee.id, employee.status)}
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: employee.status === "Active" ? "#fee2e2" : "#dcfce7", color: employee.status === "Active" ? "#991b1b" : "#166534", border: "none", padding: "0.5rem", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {employee.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem" }}>Employee</th>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem" }}>Role</th>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem" }}>Department</th>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem" }}>Salary</th>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedStaff.map((employee, i) => (
                <tr key={employee.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: employee.status === "Inactive" ? "#f8fafc" : "white", opacity: employee.status === "Inactive" ? 0.7 : 1 }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#0f172a", textDecoration: employee.status === "Inactive" ? "line-through" : "none" }}>{employee.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{employee.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "#334155" }}>
                    <div>{employee.role}</div>
                    <span style={{ backgroundColor: employee.employeeType === "Permanent" ? "#dbeafe" : "#ffedd5", padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", color: employee.employeeType === "Permanent" ? "#1e40af" : "#c2410c", fontWeight: "600", marginTop: "0.25rem", display: "inline-block" }}>
                      {employee.employeeType}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{employee.costAllocation}</td>
                  <td style={{ padding: "1rem", fontWeight: "800", color: "#0f172a" }}>${employee.salary.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "999px", fontWeight: "bold", backgroundColor: employee.status === "Active" ? "#dcfce7" : "#fee2e2", color: employee.status === "Active" ? "#166534" : "#991b1b" }}>
                      {employee.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button onClick={() => setSelectedStaff(employee)} style={{ backgroundColor: "#f8fafc", color: "#4f46e5", border: "1px solid #cbd5e1", padding: "0.4rem 0.75rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>Payslips</button>
                      <button onClick={() => openEditModal(employee)} style={{ backgroundColor: "#f8fafc", color: "#0f172a", border: "1px solid #cbd5e1", padding: "0.4rem 0.75rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
                      <button onClick={() => handleStatusChange(employee.id, employee.status)} disabled={loading} style={{ backgroundColor: employee.status === "Active" ? "#fee2e2" : "#dcfce7", color: employee.status === "Active" ? "#991b1b" : "#166534", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.8rem" }}>
                        {employee.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {processedStaff.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#64748b", marginTop: "1.5rem" }}>
          No employees found matching your criteria.
        </div>
      )}

      {/* Employee Form Modal (Add / Edit) */}
      {showFormModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "700px", maxHeight: "90vh", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>{editingId ? "Edit Employee" : "Add New Employee"}</h2>
              <button onClick={() => setShowFormModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#94a3b8", cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="e.g. Tendai Shumba" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Job Title / Role</label>
                  <input type="text" required value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="e.g. Tractor Driver" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Employee Type</label>
                  <select value={employeeType} onChange={e => setEmployeeType(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", backgroundColor: "white" }}>
                    <option>Permanent</option>
                    <option>Contract</option>
                    <option>Task Worker</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Base Salary ($)</label>
                  <input type="number" required value={salary} onChange={e => setSalary(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="0.00" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Department / Cost Allocation</label>
                  <select value={costAllocation} onChange={e => setCostAllocation(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", backgroundColor: "white" }}>
                    <option>Farm Operations</option>
                    <option>Retail Shop</option>
                    <option>Manufacturing</option>
                    <option>Administration</option>
                  </select>
                </div>

                {/* New HR Fields */}
                <h3 style={{ gridColumn: "1 / -1", fontSize: "1rem", color: "#0f172a", margin: "1rem 0 0 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>Contact & Details</h3>
                
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="+263..." />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="email@example.com" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Home Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="123 Street Name..." />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>Next of Kin (Name & Contact)</label>
                  <input type="text" value={nextOfKin} onChange={e => setNextOfKin(e.target.value)} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }} placeholder="Jane Doe - +263..." />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#334155", marginBottom: "0.5rem" }}>HR Notes (Interview, Performance, etc.)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", resize: "vertical" }} placeholder="Enter notes here..." />
                </div>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setShowFormModal(false)} style={{ flex: 1, backgroundColor: "#f1f5f9", color: "#334155", padding: "1rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={{ flex: 2, background: "linear-gradient(to right, #4f46e5, #6366f1)", color: "white", padding: "1rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)" }}>
                  {loading ? "Saving..." : (editingId ? "Save Changes" : "Add Employee")}
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
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: "800" }}>Payslips: {selectedStaff.name}</h2>
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
                    <div key={slip.id} style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
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
