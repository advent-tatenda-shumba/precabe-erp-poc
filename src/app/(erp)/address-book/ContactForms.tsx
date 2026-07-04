"use client";

import { useState } from "react";
import Modal from "../../_components/Modal";
import { showToast } from "../../_components/ToastProvider";
import { createContact } from "../../_actions";

export function AddContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createContact({
        name: fd.get("name") as string,
        contactType: fd.get("contactType") as string,
        phone: fd.get("phone") as string,
        email: fd.get("email") as string,
        address: fd.get("address") as string,
        country: fd.get("country") as string,
      });
      showToast("Contact added successfully");
      setIsOpen(false);
    } catch (err) {
      showToast("Failed to add contact", "error");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ Add Contact</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Contact" size="md">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Company / Full Name</label>
              <input name="name" type="text" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select name="contactType" className="form-select" required>
                <option>Supplier</option>
                <option>Customer</option>
                <option>Bank</option>
                <option>Contractor</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input name="phone" type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Address</label>
              <input name="address" type="text" className="form-input" />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Country</label>
              <input name="country" type="text" className="form-input" defaultValue="Zimbabwe" required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn client-btn" onClick={() => setIsOpen(false)} style={{ background: "transparent", color: "var(--text-primary)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : "Save Contact"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
