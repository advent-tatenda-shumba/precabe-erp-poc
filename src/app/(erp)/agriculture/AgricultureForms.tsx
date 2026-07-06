"use client";

import { useState } from "react";
import Modal from "../../_components/Modal";
import { showToast } from "../../_components/ToastProvider";
import { createCropCycle } from "../../_actions";

export function NewCropCycleButton({ farms, crops }: { farms: any[]; crops: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createCropCycle({
        farmId: Number(formData.get("farmId")),
        cropId: Number(formData.get("cropId")),
        season: formData.get("season") as string,
        hectares: Number(formData.get("hectares")),
        plantingDate: formData.get("plantingDate") as string,
      });
      showToast("Crop cycle created successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to create crop cycle", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ New Cycle</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Start New Crop Cycle" size="sm">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Farm Location</label>
            <select name="farmId" className="form-select" required>
              {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Crop</label>
            <select name="cropId" className="form-select" required>
              {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Season</label>
            <input name="season" type="text" className="form-input" placeholder="e.g. 2026/2027" required />
          </div>
          <div className="form-group">
            <label className="form-label">Hectares Planted</label>
            <input name="hectares" type="number" step="0.1" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Planting Date</label>
            <input name="plantingDate" type="date" className="form-input" required defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Create Cycle"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
