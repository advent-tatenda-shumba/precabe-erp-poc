"use client";

import { useState, useEffect } from "react";
import Modal from "../_components/Modal";
import { showToast } from "../_components/ToastProvider";
import { createPurchaseOrder, approvePurchaseOrder, createContact } from "../_actions";

export function NewPOButton({ contacts, farms }: { contacts: any[]; farms: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lines, setLines] = useState([{ id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
  
  const [localContacts, setLocalContacts] = useState(contacts);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | "">(contacts.length > 0 ? contacts[0].id : "");

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const addLine = () => setLines([...lines, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
  const removeLine = (id: number) => setLines(lines.filter(l => l.id !== id));

  const updateLine = (id: number, field: string, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const totalAmount = lines.reduce((acc, l) => acc + (l.quantity * l.unitPrice), 0);

  async function handleAddSupplier() {
    if (!newSupplierName.trim()) return;
    setIsCreatingContact(true);
    try {
      const newContact = await createContact({
        name: newSupplierName,
        contactType: "Supplier",
        phone: "",
        email: "",
        address: "",
        country: "Zimbabwe",
      });
      showToast("Supplier added successfully");
      setLocalContacts([...localContacts, newContact]);
      setSelectedContactId(newContact.id);
      setIsAddingSupplier(false);
      setNewSupplierName("");
    } catch (err) {
      showToast("Failed to add supplier", "error");
    }
    setIsCreatingContact(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const formattedLines = lines.map(l => ({
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        totalPrice: l.quantity * l.unitPrice
      }));

      await createPurchaseOrder({
        contactId: Number(fd.get("contactId")),
        farmId: Number(fd.get("farmId")),
        notes: fd.get("notes") as string,
        totalAmount,
        lines: formattedLines
      });
      showToast("Purchase order created successfully");
      setIsOpen(false);
      setLines([{ id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
    } catch (err) {
      showToast("Failed to create PO", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ New PO</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Purchase Order" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Supplier</span>
                {!isAddingSupplier && (
                  <button type="button" className="client-btn btn-sm" onClick={() => setIsAddingSupplier(true)} style={{ padding: "0.1rem 0.4rem", fontSize: "0.75rem", background: "transparent", color: "var(--primary)" }}>+ Add New</button>
                )}
              </label>
              {isAddingSupplier ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" className="form-input" placeholder="Supplier name..." value={newSupplierName} onChange={(e) => setNewSupplierName(e.target.value)} autoFocus />
                  <button type="button" className="btn btn-primary" onClick={handleAddSupplier} disabled={!newSupplierName.trim() || isCreatingContact}>{isCreatingContact ? "..." : "Save"}</button>
                  <button type="button" className="btn client-btn" onClick={() => setIsAddingSupplier(false)}>✕</button>
                  <input type="hidden" name="contactId" value={selectedContactId || ""} />
                </div>
              ) : (
                <select name="contactId" className="form-select" value={selectedContactId} onChange={(e) => setSelectedContactId(Number(e.target.value))} required>
                  <option value="" disabled>Select supplier...</option>
                  {localContacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Farm</label>
              <select name="farmId" className="form-select" required>
                {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <label className="form-label">Line Items</label>
            <table className="line-item-table">
              <thead>
                <tr>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>Qty</th>
                  <th style={{ width: "20%" }}>Unit Price</th>
                  <th style={{ width: "15%" }}>Total</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <input type="text" className="line-input" value={l.description} onChange={(e) => updateLine(l.id, "description", e.target.value)} required placeholder="Item..." />
                    </td>
                    <td>
                      <input type="number" className="line-input" value={l.quantity} onChange={(e) => updateLine(l.id, "quantity", Number(e.target.value))} required min="1" step="0.01" />
                    </td>
                    <td>
                      <input type="number" className="line-input" value={l.unitPrice} onChange={(e) => updateLine(l.id, "unitPrice", Number(e.target.value))} required min="0" step="0.01" />
                    </td>
                    <td style={{ fontSize: "0.85rem", fontWeight: 600, paddingLeft: "0.5rem" }}>
                      ${(l.quantity * l.unitPrice).toFixed(2)}
                    </td>
                    <td>
                      {lines.length > 1 && (
                        <button type="button" className="btn-remove-line" onClick={() => removeLine(l.id)}>×</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn-add-line" onClick={addLine}>+ Add Line Item</button>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Instructions</label>
            <input name="notes" type="text" className="form-input" placeholder="Delivery instructions..." />
          </div>

          <div className="modal-footer" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>Total: ${totalAmount.toFixed(2)}</div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Create PO"}</button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function ApprovePOButton({ poId }: { poId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleApprove() {
    setIsLoading(true);
    try {
      await approvePurchaseOrder(poId);
      showToast("PO Approved successfully");
    } catch (err) {
      showToast("Failed to approve PO", "error");
    }
    setIsLoading(false);
  }

  return (
    <button className="badge badge-blue" style={{ cursor: "pointer", border: "none", outline: "none" }} onClick={handleApprove} disabled={isLoading}>
      {isLoading ? "..." : "Approve"}
    </button>
  );
}
