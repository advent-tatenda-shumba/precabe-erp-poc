"use client";

import { useState } from "react";
import Modal from "../_components/Modal";
import { showToast } from "../_components/ToastProvider";
import { createFarm, createBankAccount } from "../_actions";

export function AddFarmButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createFarm({
        name: fd.get("name") as string,
        location: fd.get("location") as string,
        sizeHectares: Number(fd.get("sizeHectares")),
      });
      showToast("Farm added successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to add farm", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-sm" onClick={() => setIsOpen(true)}>+ Add Farm</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register New Farm" size="sm">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Farm Name</label>
            <input name="name" type="text" className="form-input" required placeholder="e.g. Sherwood Farm" />
          </div>
          <div className="form-group">
            <label className="form-label">Location / Region</label>
            <input name="location" type="text" className="form-input" required placeholder="e.g. Kwekwe" />
          </div>
          <div className="form-group">
            <label className="form-label">Size (Hectares)</label>
            <input name="sizeHectares" type="number" step="0.1" className="form-input" required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Add Farm"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function AddAccountButton({ farms }: { farms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createBankAccount({
        farmId: Number(fd.get("farmId")),
        bankName: fd.get("bankName") as string,
        accountNumber: fd.get("accountNumber") as string,
        currency: fd.get("currency") as string,
        balance: Number(fd.get("balance")),
      });
      showToast("Bank account added");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to add account", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-sm" onClick={() => setIsOpen(true)}>+ Add Account</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Bank Account" size="sm">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input name="bankName" type="text" className="form-input" required placeholder="e.g. CBZ Bank" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input name="accountNumber" type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Operating Entity (Farm)</label>
            <select name="farmId" className="form-select" required>
              {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select name="currency" className="form-select" required defaultValue="USD">
                <option>USD</option><option>ZiG</option><option>ZAR</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Opening Balance</label>
              <input name="balance" type="number" step="0.01" className="form-input" required defaultValue="0" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Add Account"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
