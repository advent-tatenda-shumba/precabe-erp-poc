"use client";

import React, { useState, useMemo } from "react";
import { checkoutAction } from "@/app/_actions/pos";
import { logoutAction } from "@/app/_actions/auth";

type InventoryItem = {
  id: number;
  itemCode?: string;
  name: string;
  unitCost: number;
  currentStock: number;
  unit: string;
};

type PosClientProps = {
  items: InventoryItem[];
  farmName: string;
  userName: string;
};

export default function PosClient({ items, farmName, userName }: PosClientProps) {
  const [cart, setCart] = useState<{ item: InventoryItem; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [cashProvided, setCashProvided] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{ items: any[], total: number, cash: number, change: number, date: Date } | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || (item.itemCode && item.itemCode.includes(search)));
  }, [items, search]);

  const addToCart = (item: InventoryItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        if (existing.qty + 1 > item.currentStock) return prev;
        return prev.map((c) => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      if (item.currentStock < 1) return prev;
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateCartQty = (itemId: number, newQty: number) => {
    setCart((prev) => {
      return prev.map(c => {
        if (c.item.id === itemId) {
          if (newQty > c.item.currentStock) return c; // Don't exceed stock
          if (newQty < 1) return c; // Use remove instead
          return { ...c, qty: newQty };
        }
        return c;
      });
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  // Prices are 2x cost for retail demo
  const total = cart.reduce((acc, c) => acc + c.item.unitCost * 2 * c.qty, 0); 
  const cashNum = parseFloat(cashProvided) || 0;
  const change = Math.max(0, cashNum - total);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    try {
      // Execute transaction on server
      const result = await checkoutAction(
        cart.map((c) => ({ itemId: c.item.id, qty: c.qty, price: c.item.unitCost * 2 }))
      );
      
      if (!result.error) {
        // Save receipt data
        setLastReceipt({
          items: cart.map(c => ({ name: c.item.name, qty: c.qty, price: c.item.unitCost * 2, total: c.qty * c.item.unitCost * 2 })),
          total,
          cash: cashNum,
          change,
          date: new Date()
        });
        
        setShowReceipt(true);
        setCart([]);
        setCashProvided("");
      } else {
        alert("Checkout failed: " + result.error);
      }
    } catch (e) {
      alert("An error occurred during checkout.");
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "1.5rem", gap: "1.5rem", maxWidth: "1400px", margin: "0 auto", width: "100%", fontFamily: "sans-serif" }}>
        {/* Left Area: Products */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {/* Header & Search */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#374151", margin: 0 }}>Products at shop1</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
                <span>Showing {filteredItems.length} of {items.length} items</span>
                <button onClick={() => window.location.reload()} style={{ padding: "0.25rem 0.75rem", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>🔄</span> Refresh
                </button>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "4px", outline: "none", fontSize: "0.875rem" }}
            />
          </div>

          {/* Product Grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", backgroundColor: "#fafaf9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", transition: "transform 0.1s", userSelect: "none" }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.5rem", minHeight: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#4f46e5", marginBottom: "0.5rem" }}>
                    ${(item.unitCost * 2).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Stock: {item.currentStock}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                    {item.itemCode || "NO-BARCODE"}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", padding: "2rem" }}>No items match your search.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Cart */}
        <div style={{ width: "360px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", borderLeft: "4px solid #fbbf24", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937", margin: "0 0 1rem 0" }}>Cart - shop1</h2>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#4b5563", cursor: "pointer" }}>
              <input type="checkbox" /> Backlog Mode (Power-Cut Sales)
            </label>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {cart.map(c => (
              <div key={c.item.id}>
                <div style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#1f2937" }}>{c.item.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#4b5563", marginBottom: "0.5rem" }}>${(c.item.unitCost * 2).toFixed(2)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af", width: "40px" }}>shop1</span>
                  <button onClick={() => updateCartQty(c.item.id, c.qty - 1)} style={{ width: "24px", height: "24px", border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>-</button>
                  <input type="text" value={c.qty} readOnly style={{ width: "40px", height: "24px", border: "1px solid #d1d5db", borderRadius: "4px", textAlign: "center", fontSize: "0.875rem" }} />
                  <button onClick={() => updateCartQty(c.item.id, c.qty + 1)} style={{ width: "24px", height: "24px", border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>+</button>
                  <button onClick={() => removeFromCart(c.item.id)} style={{ width: "24px", height: "24px", border: "none", backgroundColor: "#ef4444", color: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginLeft: "auto" }}>×</button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem", marginTop: "2rem" }}>Cart is empty</div>}
          </div>

          <div style={{ padding: "1.5rem", backgroundColor: "#fafaf9", borderTop: "1px solid #e5e7eb", borderRadius: "0 0 8px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#1f2937" }}>Total:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>${total.toFixed(2)}</span>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#4b5563", marginBottom: "0.25rem" }}>Cash Provided:</label>
              <input 
                type="number" 
                value={cashProvided} 
                onChange={(e) => setCashProvided(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #4f46e5", borderRadius: "4px", textAlign: "right", outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{ flex: 1, padding: "0.75rem", backgroundColor: "#4338ca", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>Preview</button>
              <button 
                onClick={handleCheckout} 
                disabled={cart.length === 0 || loading}
                style={{ flex: 1, padding: "0.75rem", backgroundColor: cart.length === 0 ? "#c7d2fe" : "#4338ca", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: cart.length === 0 ? "not-allowed" : "pointer" }}
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastReceipt && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "white", width: "320px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "2rem", flex: 1, overflowY: "auto", fontFamily: "monospace", color: "#1f2937" }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>{farmName} - Shop 1</h3>
                <div style={{ fontSize: "0.75rem" }}>Tax Invoice</div>
                <div style={{ fontSize: "0.75rem" }}>Date: {lastReceipt.date.toLocaleString()}</div>
                <div style={{ fontSize: "0.75rem" }}>Cashier: {userName}</div>
              </div>
              <div style={{ borderTop: "1px dashed #d1d5db", borderBottom: "1px dashed #d1d5db", padding: "0.5rem 0", margin: "1rem 0" }}>
                {lastReceipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                    <span style={{ flex: 1 }}>{item.qty}x {item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1rem", marginBottom: "0.5rem" }}>
                <span>TOTAL DUE</span>
                <span>${lastReceipt.total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <span>CASH TENDERED</span>
                <span>${lastReceipt.cash.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: "bold" }}>
                <span>CHANGE</span>
                <span>${lastReceipt.change.toFixed(2)}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem" }}>
                Thank you for shopping with us!
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: "1rem", gap: "1rem", backgroundColor: "#f9fafb" }}>
              <button onClick={() => setShowReceipt(false)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "4px", cursor: "pointer" }}>Close</button>
              <button onClick={() => { alert("Printing Receipt..."); setShowReceipt(false); }} style={{ flex: 1, padding: "0.5rem", border: "none", backgroundColor: "#4f46e5", color: "white", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Print</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
