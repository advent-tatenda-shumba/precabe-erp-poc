"use client";

import React, { useState, useEffect } from "react";

type InvoiceLine = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Invoice = {
  id: number;
  invoiceNumber: string;
  date: Date;
  status: string;
  totalAmount: number;
  lines: InvoiceLine[];
};

export default function SalesClient({ invoices, userName, farmName }: { invoices: Invoice[], userName: string, farmName: string }) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const exportToCSV = () => {
    // Flatten lines for CSV export
    const rows = [
      ["Date", "Receipt No", "Cashier", "Item Name", "Quantity", "Unit Price", "Total Price"]
    ];

    invoices.forEach(inv => {
      inv.lines.forEach(line => {
        rows.push([
          new Date(inv.date).toLocaleString(),
          inv.invoiceNumber,
          userName,
          line.description,
          line.quantity.toString(),
          line.unitPrice.toFixed(2),
          line.totalPrice.toFixed(2)
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sales_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Sales History</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #d1d5db" }}>
            <option>Today</option>
            <option>Past 7 Days</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button onClick={exportToCSV} style={{ backgroundColor: "#4f46e5", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
            📊 Export to Excel
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937" }}>Transactions</div>
        <div style={{ color: "#6b7280", marginTop: "0.25rem" }}>{invoices.length}</div>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Date</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Receipt No</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Items</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Cashier</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "1rem", fontSize: "0.75rem", color: "#4b5563", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  {isMounted ? new Date(inv.date).toLocaleString() : "..."}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  {inv.invoiceNumber}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  {inv.lines.reduce((acc, line) => acc + line.quantity, 0)}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  {userName}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  {inv.status.toUpperCase()}
                </td>
                <td style={{ padding: "1rem" }}>
                  <button onClick={() => setSelectedInvoice(inv)} style={{ backgroundColor: "#0284c7", color: "white", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {selectedInvoice && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "white", width: "320px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
            <div style={{ padding: "2rem", flex: 1, overflowY: "auto", fontFamily: "monospace", color: "#1f2937" }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>{farmName} - Shop 1</h3>
                <div style={{ fontSize: "0.75rem" }}>Tax Invoice</div>
                <div style={{ fontSize: "0.75rem" }}>Receipt No: {selectedInvoice.invoiceNumber}</div>
                <div style={{ fontSize: "0.75rem" }}>Date: {isMounted ? new Date(selectedInvoice.date).toLocaleString() : "..."}</div>
                <div style={{ fontSize: "0.75rem" }}>Cashier: {userName}</div>
              </div>
              <div style={{ borderTop: "1px dashed #d1d5db", borderBottom: "1px dashed #d1d5db", padding: "0.5rem 0", margin: "1rem 0" }}>
                {selectedInvoice.lines.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                    <span style={{ flex: 1 }}>{item.quantity}x {item.description}</span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1rem", marginBottom: "0.5rem" }}>
                <span>TOTAL PAID</span>
                <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem" }}>
                Thank you for shopping with us!
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: "1rem", gap: "1rem", backgroundColor: "#f9fafb" }}>
              <button onClick={() => setSelectedInvoice(null)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "4px", cursor: "pointer" }}>Close</button>
              <button onClick={() => { alert("Printing Receipt..."); setSelectedInvoice(null); }} style={{ flex: 1, padding: "0.5rem", border: "none", backgroundColor: "#4f46e5", color: "white", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Print</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
