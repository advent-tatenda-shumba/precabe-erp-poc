"use client";

import { useState } from "react";
import Modal from "../_components/Modal";
import { showToast } from "../_components/ToastProvider";
import { createFixedAsset } from "../_actions";

export function RegisterAssetButton({ farms }: { farms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createFixedAsset({
        name: fd.get("name") as string,
        category: fd.get("category") as string,
        farmId: Number(fd.get("farmId")),
        purchaseDate: fd.get("purchaseDate") as string,
        purchaseCost: Number(fd.get("purchaseCost")),
        usefulLifeYears: Number(fd.get("usefulLifeYears")),
        residualValue: Number(fd.get("residualValue")),
      });
      showToast("Asset registered successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to register asset", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ Register Asset</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Fixed Asset" size="md">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Asset Name</label>
              <input name="name" type="text" className="form-input" required placeholder="e.g. John Deere Tractor" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" required>
                <option>Vehicles</option>
                <option>Machinery</option>
                <option>Buildings</option>
                <option>Land</option>
                <option>IT Equipment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location (Farm)</label>
              <select name="farmId" className="form-select" required>
                {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input name="purchaseDate" type="date" className="form-input" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Cost (USD)</label>
              <input name="purchaseCost" type="number" step="0.01" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Residual Value (USD)</label>
              <input name="residualValue" type="number" step="0.01" className="form-input" required defaultValue="0" />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Useful Life (Years)</label>
              <input name="usefulLifeYears" type="number" className="form-input" required defaultValue="5" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Register Asset"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
