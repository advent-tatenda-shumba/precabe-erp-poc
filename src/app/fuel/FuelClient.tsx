"use client";

import React, { useState, useMemo } from "react";
import { logFuelAction } from "@/app/_actions/fuel";
import { logoutAction } from "@/app/_actions/auth";

type FuelTank = {
  id: number;
  tankCode: string;
  fuelType: string;
  capacityLitres: number;
  currentLitres: number;
};

// Assuming txType is "Dispatch" or "Receipt", and reference stores JSON for extra fields
type FuelTx = {
  id: number;
  txType: string;
  litres: number;
  date: Date;
  reference: string | null;
  tank: { fuelType: string; tankCode: string };
};

export default function FuelClient({ tanks, recentTxs, farmName, userName }: { tanks: FuelTank[], recentTxs: FuelTx[], farmName: string, userName: string }) {
  const [activeTab, setActiveTab] = useState("Log");
  const [modalMode, setModalMode] = useState<"Receipt" | "Issue" | null>(null);

  // Filter States
  const [filterType, setFilterType] = useState("All Types");
  const [filterFuel, setFilterFuel] = useState("All Fuel");
  const [filterField, setFilterField] = useState("All Fields");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const filteredTxs = useMemo(() => {
    return recentTxs.filter(tx => {
      let refData: any = {};
      try { refData = JSON.parse(tx.reference || "{}"); } catch (e) {}

      if (filterType === "Issue" && tx.txType !== "Dispatch") return false;
      if (filterType === "Receipt" && tx.txType !== "Receipt") return false;
      if (filterFuel !== "All Fuel" && !tx.tank.fuelType.toLowerCase().includes(filterFuel.toLowerCase())) return false;
      
      const txField = refData.field || tx.tank.tankCode;
      if (filterField !== "All Fields" && txField !== filterField) return false;

      const txDate = new Date(tx.date);
      txDate.setHours(0,0,0,0);
      
      if (filterStartDate) {
        const start = new Date(filterStartDate);
        start.setHours(0,0,0,0);
        if (txDate < start) return false;
      }
      if (filterEndDate) {
        const end = new Date(filterEndDate);
        end.setHours(0,0,0,0);
        if (txDate > end) return false;
      }

      return true;
    });
  }, [recentTxs, filterType, filterFuel, filterField, filterStartDate, filterEndDate]);

  const uniqueFields = useMemo(() => {
    const fields = new Set<string>();
    recentTxs.forEach(tx => {
      let refData: any = {};
      try { refData = JSON.parse(tx.reference || "{}"); } catch (e) {}
      if (refData.field) fields.add(refData.field);
      else fields.add(tx.tank.tankCode);
    });
    return Array.from(fields);
  }, [recentTxs]);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTank, setSelectedTank] = useState<number | "">("");
  const [litres, setLitres] = useState<number | "">("");
  
  // Issue specific state
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [purpose, setPurpose] = useState("");
  const [field, setField] = useState("");
  const [kmReading, setKmReading] = useState("");
  const [authorizedBy, setAuthorizedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Receipt specific state
  const [supplier, setSupplier] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTank || !litres) return;

    setLoading(true);
    setMessage(null);

    let referenceData: any = {};
    if (modalMode === "Issue") {
      referenceData = { vehicle, driver, purpose, field, kmReading, authorizedBy, remarks, hasImage: !!imagePreview };
    } else {
      referenceData = { supplier };
    }

    const result = await logFuelAction({
      tankId: Number(selectedTank),
      litres: Number(litres),
      txType: modalMode!,
      reference: JSON.stringify(referenceData)
    });

    if (result.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: `Fuel ${modalMode?.toLowerCase()} recorded successfully!`, type: "success" });
      setTimeout(() => window.location.reload(), 1000);
    }
    setLoading(false);
  };

  const dieselBalance = tanks.filter(t => t.fuelType.toLowerCase().includes("diesel")).reduce((a, b) => a + b.currentLitres, 0);
  const petrolBalance = tanks.filter(t => t.fuelType.toLowerCase().includes("petrol")).reduce((a, b) => a + b.currentLitres, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header className="fuel-header" style={{ padding: "1.5rem 2rem", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: 0, color: "#0f172a", fontWeight: "bold" }}>Fuel Management</h1>
          <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Track diesel and petrol usage across all vehicles and fields at {farmName}</div>
        </div>
        <div className="fuel-header-actions">
          <button 
            className="fuel-btn"
            onClick={() => setModalMode("Receipt")}
            style={{ padding: "0.75rem 1.5rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
          >
            ↗ Record Receipt
          </button>
          <button 
            className="fuel-btn"
            onClick={() => setModalMode("Issue")}
            style={{ padding: "0.75rem 1.5rem", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
          >
            ↘ Record Issue
          </button>
          <button className="fuel-btn" onClick={() => logoutAction()} style={{ padding: "0.75rem 1rem", background: "#f1f5f9", border: "none", color: "#334155", borderRadius: "8px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Stat Cards */}
        <div className="fuel-stat-grid">
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", marginBottom: "1rem" }}>
              <span style={{ color: "#3b82f6" }}>💧</span> Diesel Balance
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444" }}>{dieselBalance.toFixed(1)}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>litres available</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", marginBottom: "1rem" }}>
              <span style={{ color: "#10b981" }}>💧</span> Petrol Balance
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444" }}>{petrolBalance.toFixed(1)}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>litres available</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", marginBottom: "1rem" }}>
              <span style={{ color: "#f59e0b" }}>📉</span> Issued This Month
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0f172a" }}>
              {recentTxs.filter(tx => tx.txType === "Dispatch").reduce((a, b) => a + b.litres, 0).toFixed(0)}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>litres total</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", marginBottom: "1rem" }}>
              <span style={{ color: "#8b5cf6" }}>📄</span> Total Entries
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0f172a" }}>{recentTxs.length}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>logged transactions</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem", overflowX: "auto" }}>
          {["Log", "By Vehicle", "By Field"].map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: "1rem 0", 
                fontWeight: activeTab === tab ? "bold" : "normal", 
                color: activeTab === tab ? "#0284c7" : "#64748b",
                borderBottom: activeTab === tab ? "2px solid #0284c7" : "none",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="fuel-filter-bar">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }}>
            <option>All Types</option>
            <option>Issue</option>
            <option>Receipt</option>
          </select>
          <select value={filterFuel} onChange={e => setFilterFuel(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }}>
            <option>All Fuel</option>
            <option>Diesel</option>
            <option>Petrol</option>
          </select>
          <select value={filterField} onChange={e => setFilterField(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }}>
            <option>All Fields</option>
            {uniqueFields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }} />
          <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }} />
        </div>

        {/* Transactions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredTxs.map(tx => {
            let refData: any = {};
            try { refData = JSON.parse(tx.reference || "{}"); } catch (e) {}

            return (
              <div key={tx.id} className="fuel-tx-card" style={{ border: `1px solid ${tx.txType === "Dispatch" ? "#bfdbfe" : "#bbf7d0"}` }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ backgroundColor: tx.txType === "Dispatch" ? "#eff6ff" : "#f0fdf4", color: tx.txType === "Dispatch" ? "#2563eb" : "#16a34a", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                      {tx.txType === "Dispatch" ? "▼ Issue" : "▲ Receipt"}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "lowercase" }}>{tx.tank.fuelType}</span>
                    <span style={{ fontSize: "0.875rem", color: "#a855f7", backgroundColor: "#faf5ff", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                      {refData.field || tx.tank.tankCode}
                    </span>
                  </div>
                  <div className="fuel-tx-main-row" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{tx.litres} L</span>
                    {refData.vehicle && <span style={{ color: "#64748b", fontSize: "0.875rem", whiteSpace: "nowrap" }}>🚜 {refData.vehicle}</span>}
                    {refData.driver && <span style={{ color: "#64748b", fontSize: "0.875rem", whiteSpace: "nowrap" }}>👤 {refData.driver}</span>}
                    {refData.authorizedBy && <span style={{ color: "#64748b", fontSize: "0.875rem", whiteSpace: "nowrap" }}>✓ {refData.authorizedBy}</span>}
                    {refData.hasImage && <span style={{ color: "#3b82f6", fontSize: "0.875rem", whiteSpace: "nowrap" }}>📸 Photo Attached</span>}
                  </div>
                  {refData.purpose && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#94a3b8" }}>
                      Original Dest: {refData.purpose}
                    </div>
                  )}
                </div>
                <div className="fuel-tx-details" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  <span>{new Date(tx.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{farmName}</span>
                </div>
              </div>
            );
          })}
          {filteredTxs.length === 0 && <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No transactions match your filters.</div>}
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: "bold" }}>Record Fuel {modalMode}</h2>
                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  {modalMode === "Issue" ? "Fuel issued to vehicle/equipment" : "Fuel received into storage"}
                </div>
              </div>
              <button onClick={() => setModalMode(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#94a3b8", cursor: "pointer" }}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Date *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Pump Location *</label>
                  <select value={selectedTank} onChange={e => setSelectedTank(e.target.value ? Number(e.target.value) : "")} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                    <option value="">-- Choose --</option>
                    {tanks.map(t => <option key={t.id} value={t.id}>{t.tankCode} ({t.fuelType})</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Quantity (litres) *</label>
                <input type="number" step="0.1" value={litres} onChange={e => setLitres(e.target.value ? Number(e.target.value) : "")} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
              </div>

              {modalMode === "Issue" ? (
                <>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Vehicle / Equipment</label>
                      <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="e.g. Case Excavator" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Driver / Operator</label>
                      <input type="text" value={driver} onChange={e => setDriver(e.target.value)} placeholder="e.g. John" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Purpose</label>
                      <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Drainage Work" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Field</label>
                      <input type="text" value={field} onChange={e => setField(e.target.value)} placeholder="e.g. CP4" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>KM / Hours Reading</label>
                      <input type="text" value={kmReading} onChange={e => setKmReading(e.target.value)} placeholder="e.g. 2 hours" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Authorized By</label>
                      <input type="text" value={authorizedBy} onChange={e => setAuthorizedBy(e.target.value)} placeholder="e.g. Mashate" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Attach Photo of Vehicle/Container</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "0.75rem", border: "1px dashed #cbd5e1", borderRadius: "6px", backgroundColor: "#f8fafc" }} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: "1rem", maxHeight: "150px", borderRadius: "6px" }} />}
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Source / Supplier</label>
                  <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="e.g. GTS fuels" style={{ width: "100%", padding: "0.75rem", border: "1px solid #38bdf8", borderRadius: "6px", outline: "none", boxShadow: "0 0 0 1px #38bdf8" }} />
                </div>
              )}

              {message && (
                <div style={{ padding: "0.75rem", borderRadius: "4px", backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2", color: message.type === "success" ? "#166534" : "#991b1b", fontSize: "0.875rem", marginTop: "1rem" }}>
                  {message.text}
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                <button type="button" onClick={() => setModalMode(null)} style={{ flex: 1, padding: "1rem", backgroundColor: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "1rem", backgroundColor: modalMode === "Issue" ? "#0284c7" : "#10b981", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Saving..." : modalMode === "Issue" ? "▼ Record Issue" : "▲ Record Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
