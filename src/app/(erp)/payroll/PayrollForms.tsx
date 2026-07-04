"use client";

import { useState } from "react";
import Modal from "../../_components/Modal";
import { showToast } from "../../_components/ToastProvider";
import { runPayroll } from "../../_actions";

export function RunPayrollButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Default to current month e.g., "July 2026"
  const defaultMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await runPayroll({
        month: fd.get("month") as string,
      });
      showToast("Payroll processed successfully");
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to run payroll", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>Run Payroll</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Process Monthly Payroll" size="sm">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Payroll Month</label>
            <input name="month" type="text" className="form-input" required defaultValue={defaultMonth} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              This will calculate PAYE, NSSA, and Net Salary for all active employees based on current tax brackets.
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Processing..." : "Run Payroll"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
