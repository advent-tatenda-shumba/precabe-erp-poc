"use client";

import { useState } from "react";
import Modal from "../_components/Modal";
import { showToast } from "../_components/ToastProvider";
import { addInventoryStock, transferStock, logFuelDelivery } from "../_actions";

export function AddStockButton({ items }: { items: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await addInventoryStock({
        itemId: Number(fd.get("itemId")),
        quantity: Number(fd.get("quantity")),
        unitCost: Number(fd.get("unitCost")),
        notes: fd.get("notes") as string,
      });
      showToast("Stock added successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to add stock", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ Add Stock</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Stock (Goods Received)">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item</label>
            <select name="itemId" className="form-select" required>
              {items.map((i) => <option key={i.id} value={i.id}>{i.itemCode} — {i.name} ({i.warehouse.name})</option>)}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Quantity Received</label>
              <input name="quantity" type="number" step="0.01" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Cost ($)</label>
              <input name="unitCost" type="number" step="0.01" className="form-input" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Reference</label>
            <input name="notes" type="text" className="form-input" placeholder="Supplier or Delivery Note..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Add Stock"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function TransferStockButton({ items, warehouses }: { items: any[]; warehouses: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await transferStock({
        itemId: Number(fd.get("itemId")),
        toWarehouseId: Number(fd.get("toWarehouseId")),
        quantity: Number(fd.get("quantity")),
        notes: fd.get("notes") as string,
      });
      showToast("Stock transferred successfully");
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message || "Transfer failed", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="client-btn" style={{ background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }} onClick={() => setIsOpen(true)}>Transfer Stock</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Inter-Farm Stock Transfer">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Source Item</label>
            <select name="itemId" className="form-select" required>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} (Current: {i.currentStock} in {i.warehouse.name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Destination Warehouse</label>
            <select name="toWarehouseId" className="form-select" required>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.farm.name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Transfer Quantity</label>
            <input name="quantity" type="number" step="0.01" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input name="notes" type="text" className="form-input" placeholder="Driver name, vehicle req..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Processing..." : "Transfer"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function LogFuelDeliveryButton({ tanks }: { tanks: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await logFuelDelivery({
        tankId: Number(fd.get("tankId")),
        litres: Number(fd.get("litres")),
        reference: fd.get("reference") as string,
      });
      showToast("Fuel delivery logged");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to log fuel", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="client-btn" style={{ background: "var(--card-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", alignSelf: "center", justifySelf: "end" }} onClick={() => setIsOpen(true)}>+ Log Delivery</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Bulk Fuel Delivery">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Fuel Tank</label>
            <select name="tankId" className="form-select" required>
              {tanks.map((t) => <option key={t.id} value={t.id}>{t.tankCode} — {t.fuelType} ({t.farm.name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Litres Delivered</label>
            <input name="litres" type="number" step="0.1" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Supplier / GRV Reference</label>
            <input name="reference" type="text" className="form-input" required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Log Delivery"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
