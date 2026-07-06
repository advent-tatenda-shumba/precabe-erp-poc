"use client";

import { useState } from "react";
import Modal from "../../_components/Modal";
import { showToast } from "../../_components/ToastProvider";
import { createLivestockBatch, logLivestockEvent } from "../../_actions";

export function NewBatchButton({ farms }: { farms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createLivestockBatch({
        farmId: Number(fd.get("farmId")),
        species: fd.get("species") as string,
        batchCode: fd.get("batchCode") as string,
        purpose: fd.get("purpose") as string,
        headCount: Number(fd.get("headCount")),
      });
      showToast("Livestock batch created");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to create batch", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ New Batch</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Livestock Batch">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Farm Location</label>
              <select name="farmId" className="form-select" required>
                {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Species</label>
              <select name="species" className="form-select" required>
                <option>Cattle</option><option>Goats</option><option>Sheep</option><option>Pigs</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Batch Code</label>
              <input name="batchCode" type="text" className="form-input" placeholder="e.g. CATT-2026-A" required />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Head Count</label>
              <input name="headCount" type="number" className="form-input" required />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Purpose</label>
              <select name="purpose" className="form-select" required>
                <option>Breeding</option><option>Fattening</option><option>Dairy</option><option>Draft</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Create Batch"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function LogEventButton({ batches }: { batches: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await logLivestockEvent({
        batchId: Number(fd.get("batchId")),
        eventType: fd.get("eventType") as string,
        quantity: Number(fd.get("quantity")),
        unitValue: Number(fd.get("unitValue") || 0),
        notes: fd.get("notes") as string,
        date: fd.get("date") as string,
      });
      showToast("Event logged successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to log event", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn" style={{ background: "var(--card-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }} onClick={() => setIsOpen(true)}>+ Log Event</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Livestock Event">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Target Batch</label>
            <select name="batchId" className="form-select" required>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.batchCode} ({b.species} - {b.headCount} head)</option>)}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select name="eventType" className="form-select" required>
                <option>Birth</option><option>Death</option><option>Purchase</option><option>Sale</option><option>Treatment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (Head)</label>
              <input name="quantity" type="number" className="form-input" min="1" required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Value ($) (Optional)</label>
              <input name="unitValue" type="number" step="0.01" className="form-input" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input name="date" type="date" className="form-input" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input name="notes" type="text" className="form-input" placeholder="Reason or tags..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Log Event"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
