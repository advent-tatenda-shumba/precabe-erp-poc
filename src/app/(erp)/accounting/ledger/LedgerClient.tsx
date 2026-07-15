"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/app/_components/Modal";
import { showToast } from "@/app/_components/ToastProvider";
import { ExportCSVButton } from "@/app/_components/ExportCSVButton";

type JournalLine = {
  account: string;
  description: string;
  debit: string;
  credit: string;
};

export default function LedgerClient() {
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [lines, setLines] = useState<JournalLine[]>([
    { account: "", description: "", debit: "", credit: "" },
    { account: "", description: "", debit: "", credit: "" }
  ]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.01;

  const addLine = () => {
    setLines([...lines, { account: "", description: "", debit: "", credit: "" }]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return;
    const newLines = [...lines];
    newLines.splice(index, 1);
    setLines(newLines);
  };

  const updateLine = (index: number, field: keyof JournalLine, value: string) => {
    const newLines = [...lines];
    newLines[index][field] = value;
    
    // Clear the opposite field if entering a value
    if (field === "debit" && value !== "") newLines[index].credit = "";
    if (field === "credit" && value !== "") newLines[index].debit = "";
    
    setLines(newLines);
  };

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert("Debits must equal Credits before posting.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      showToast("Journal Entry posted successfully (Simulated)");
      setIsSubmitting(false);
      setIsJournalModalOpen(false);
      // Reset form
      setLines([{ account: "", description: "", debit: "", credit: "" }, { account: "", description: "", debit: "", credit: "" }]);
      setReference("");
    }, 1000);
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Link href="/accounting" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>&larr; Back to Dashboard</Link>
          </div>
          <h1>General Ledger</h1>
          <p className="subtitle">Master Chart of Accounts & Journal Entries</p>
        </div>
        <div className="page-actions">
          <ExportCSVButton 
            headers={["Date", "Entry ID", "Account", "Description", "Debit", "Credit", "Balance"]}
            rows={[
              ["2026-07-14", "JE-1042", "1010 - Bank (CABS)", "Customer Payment", "4500", "0", "18500"],
              ["2026-07-14", "JE-1042", "4010 - Sales (Beef)", "Customer Payment", "0", "4500", "125000"]
            ]}
            filename="general_ledger"
            label="Export Ledger"
          />
          <button className="btn btn-primary" onClick={() => setIsJournalModalOpen(true)}>+ New Journal Entry</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <input type="text" className="form-input" placeholder="Search by Account, Reference, or Description..." />
          </div>
          <div className="form-group" style={{ width: "200px", margin: 0 }}>
            <select className="form-input">
              <option>All Accounts</option>
              <option>1000 - Assets</option>
              <option>2000 - Liabilities</option>
              <option>3000 - Equity</option>
              <option>4000 - Revenue</option>
              <option>5000 - Expenses</option>
            </select>
          </div>
          <div className="form-group" style={{ width: "200px", margin: 0 }}>
            <input type="date" className="form-input" defaultValue={date} />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry ID</th>
                <th>Account</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Debit (DR)</th>
                <th style={{ textAlign: "right" }}>Credit (CR)</th>
                <th style={{ textAlign: "right" }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data */}
              <tr>
                <td>2026-07-14</td>
                <td><span className="badge badge-gray">JE-1042</span></td>
                <td><strong>1010 - Bank (CABS)</strong></td>
                <td>Customer Payment (Inv #1042)</td>
                <td style={{ textAlign: "right", color: "var(--success)" }}>$4,500.00</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$18,500.00</td>
              </tr>
              <tr>
                <td>2026-07-14</td>
                <td><span className="badge badge-gray">JE-1042</span></td>
                <td><strong>4010 - Sales (Beef)</strong></td>
                <td>Customer Payment (Inv #1042)</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$4,500.00</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$125,000.00</td>
              </tr>
              <tr>
                <td>2026-07-13</td>
                <td><span className="badge badge-gray">JE-1041</span></td>
                <td><strong>5020 - Fuel Expense</strong></td>
                <td>Diesel Delivery (5000L)</td>
                <td style={{ textAlign: "right", color: "var(--success)" }}>$7,200.00</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$14,400.00</td>
              </tr>
              <tr>
                <td>2026-07-13</td>
                <td><span className="badge badge-gray">JE-1041</span></td>
                <td><strong>2010 - Accounts Payable</strong></td>
                <td>Zuva Petroleum</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$7,200.00</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$12,900.00</td>
              </tr>
              <tr>
                <td>2026-07-12</td>
                <td><span className="badge badge-gray">JE-1040</span></td>
                <td><strong>1200 - Inter-farm Loan</strong></td>
                <td>Transfer to Mazoe (Seed Cash)</td>
                <td style={{ textAlign: "right", color: "var(--success)" }}>$2,500.00</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$45,000.00</td>
              </tr>
              <tr>
                <td>2026-07-12</td>
                <td><span className="badge badge-gray">JE-1040</span></td>
                <td><strong>1010 - Bank (CABS)</strong></td>
                <td>Transfer to Mazoe (Seed Cash)</td>
                <td style={{ textAlign: "right" }}>-</td>
                <td style={{ textAlign: "right", color: "var(--text-primary)" }}>$2,500.00</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>$14,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Entry Modal */}
      <Modal isOpen={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)} title="Create Journal Entry" size="lg">
        <form onSubmit={handlePostJournal}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Reference / Memo</label>
              <input type="text" className="form-input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. Month-end Accrual" required />
            </div>
          </div>

          <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr 2fr 2fr 40px", gap: "0.5rem", fontWeight: "bold", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem", padding: "0 0.5rem" }}>
              <div>Account</div>
              <div>Description</div>
              <div>Debit ($)</div>
              <div>Credit ($)</div>
              <div></div>
            </div>

            {lines.map((line, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 3fr 2fr 2fr 40px", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <select className="form-input" style={{ padding: "0.5rem" }} value={line.account} onChange={(e) => updateLine(idx, "account", e.target.value)} required>
                  <option value="">Select Account...</option>
                  <optgroup label="Assets">
                    <option value="1010">1010 - Bank (CABS)</option>
                    <option value="1100">1100 - Accounts Receivable</option>
                    <option value="1200">1200 - Inter-farm Loan</option>
                    <option value="1500">1500 - Inventory (Fertilizer)</option>
                  </optgroup>
                  <optgroup label="Liabilities">
                    <option value="2010">2010 - Accounts Payable</option>
                    <option value="2100">2100 - Payroll Liabilities</option>
                  </optgroup>
                  <optgroup label="Equity">
                    <option value="3000">3000 - Owner's Equity</option>
                  </optgroup>
                  <optgroup label="Revenue">
                    <option value="4010">4010 - Sales (Beef)</option>
                    <option value="4020">4020 - Sales (Crops)</option>
                  </optgroup>
                  <optgroup label="Expenses">
                    <option value="5010">5010 - Payroll Expense</option>
                    <option value="5020">5020 - Fuel Expense</option>
                    <option value="5030">5030 - Maintenance Expense</option>
                  </optgroup>
                </select>
                <input type="text" className="form-input" style={{ padding: "0.5rem" }} placeholder="Line description..." value={line.description} onChange={(e) => updateLine(idx, "description", e.target.value)} required />
                <input type="number" step="0.01" min="0" className="form-input" style={{ padding: "0.5rem", textAlign: "right" }} placeholder="0.00" value={line.debit} onChange={(e) => updateLine(idx, "debit", e.target.value)} />
                <input type="number" step="0.01" min="0" className="form-input" style={{ padding: "0.5rem", textAlign: "right" }} placeholder="0.00" value={line.credit} onChange={(e) => updateLine(idx, "credit", e.target.value)} />
                <button type="button" onClick={() => removeLine(idx)} disabled={lines.length <= 2} style={{ background: "none", border: "none", color: "var(--danger)", cursor: lines.length <= 2 ? "not-allowed" : "pointer", opacity: lines.length <= 2 ? 0.3 : 1 }}>
                  &times;
                </button>
              </div>
            ))}

            <button type="button" onClick={addLine} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "bold", cursor: "pointer", padding: "0.5rem", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              + Add Line
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "2rem", marginBottom: "1.5rem", padding: "1rem", backgroundColor: isBalanced ? "#dcfce7" : "#fee2e2", borderRadius: "8px", border: `1px solid ${isBalanced ? "#166534" : "#991b1b"}` }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.875rem", color: isBalanced ? "#166534" : "#991b1b" }}>Total Debits</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: isBalanced ? "#166534" : "#991b1b" }}>${totalDebit.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.875rem", color: isBalanced ? "#166534" : "#991b1b" }}>Total Credits</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: isBalanced ? "#166534" : "#991b1b" }}>${totalCredit.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: "right", borderLeft: `1px solid ${isBalanced ? "#166534" : "#991b1b"}`, paddingLeft: "2rem" }}>
              <div style={{ fontSize: "0.875rem", color: isBalanced ? "#166534" : "#991b1b" }}>Difference</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: isBalanced ? "#166534" : "#991b1b" }}>${Math.abs(totalDebit - totalCredit).toFixed(2)}</div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsJournalModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!isBalanced || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Journal Entry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
