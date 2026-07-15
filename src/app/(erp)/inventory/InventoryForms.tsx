"use client";

import { useState } from "react";
import Modal from "../../_components/Modal";
import { showToast } from "../../_components/ToastProvider";
import { addInventoryStock, transferStock, logFuelDelivery } from "../../_actions";

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

import { adjustPriceAction } from "../../_actions/inventory";

export function AdjustPriceButton({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await adjustPriceAction(item.id, Number(fd.get("newCostPrice")), Number(fd.get("newSellPrice")));
      showToast("Prices adjusted successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to adjust price", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="client-btn btn-sm" style={{ background: "transparent", color: "#3b82f6", border: "1px solid #3b82f6" }} onClick={() => setIsOpen(true)}>Adjust Cost</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Adjust Cost: ${item.name}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">New Cost Price ($)</label>
              <input name="newCostPrice" type="number" step="0.01" defaultValue={item.unitCost} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">New Sell Price ($)</label>
              <input name="newSellPrice" type="number" step="0.01" defaultValue={item.sellPrice} className="form-input" required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: "#3b82f6" }} disabled={isLoading}>{isLoading ? "Saving..." : "Update Cost"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

import { createInventoryItemAction } from "../../_actions";

export function CreateItemButton({ warehouses }: { warehouses: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createInventoryItemAction({
        name: fd.get("name") as string,
        itemCode: fd.get("itemCode") as string,
        category: fd.get("category") as string,
        unit: fd.get("unit") as string,
        unitCost: Number(fd.get("unitCost")),
        sellPrice: Number(fd.get("sellPrice")),
        currentStock: Number(fd.get("currentStock")),
        reorderLevel: Number(fd.get("reorderLevel")),
        warehouseId: Number(fd.get("warehouseId")),
      });
      showToast("Item created successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to create item", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ New Item</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Item">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input name="name" type="text" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Item Code (Optional)</label>
              <input name="itemCode" type="text" className="form-input" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input name="category" type="text" placeholder="e.g. Beverage, Meat" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Warehouse</label>
              <select name="warehouseId" className="form-select" required>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.farm.name})</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input name="currentStock" type="number" step="0.01" defaultValue="0" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Cost Price ($)</label>
              <input name="unitCost" type="number" step="0.01" defaultValue="0" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Sell Price ($)</label>
              <input name="sellPrice" type="number" step="0.01" defaultValue="0" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Reorder Level</label>
              <input name="reorderLevel" type="number" step="0.01" defaultValue="10" className="form-input" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <input name="unit" type="text" placeholder="e.g. kg, bottles, packs" className="form-input" required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Create Item"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
