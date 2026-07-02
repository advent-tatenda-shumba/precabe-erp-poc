"use client";

import { useState } from "react";
import Modal from "../_components/Modal";
import { showToast } from "../_components/ToastProvider";
import { createProductionOrder } from "../_actions";

export function NewProductionOrderButton({ boms }: { boms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createProductionOrder({
        bomId: Number(fd.get("bomId")),
        quantity: Number(fd.get("quantity")),
      });
      showToast("Production order planned successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to plan production", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ New Production Run</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Plan Production Run" size="sm">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bill of Materials / Recipe</label>
            <select name="bomId" className="form-select" required>
              {boms.map((b) => <option key={b.id} value={b.id}>{b.productName} (Batch: {b.batchSize} {b.unit})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target Quantity (Units)</label>
            <input name="quantity" type="number" step="0.1" className="form-input" required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Plan Run"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
