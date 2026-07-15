"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

type BarClientProps = {
  items: InventoryItem[];
  recentSales: any[];
  farmName: string;
  userName: string;
};

export default function BarClient({ items, recentSales, farmName, userName }: BarClientProps) {
  const router = useRouter();
  const [cart, setCart] = useState<{ item: InventoryItem; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [cashProvided, setCashProvided] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{ items: any[], total: number, cash: number, change: number, date: Date } | null>(null);

  // Filter items specifically for the Bar (and search)
  // For the demo, we show everything but in reality we might filter by category === "Alcohol" etc.
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
          if (newQty > c.item.currentStock) return c;
          if (newQty < 1) return c;
          return { ...c, qty: newQty };
        }
        return c;
      });
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const total = cart.reduce((acc, c) => acc + (c.item.sellPrice || 0) * c.qty, 0); 
  const cashNum = parseFloat(cashProvided) || 0;
  const change = Math.max(0, cashNum - total);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    try {
      const result = await checkoutAction(
        cart.map((c) => ({ itemId: c.item.id, qty: c.qty, price: c.item.sellPrice })),
        "Bar" // This routes the sales specifically to the Bar outlet
      );
      
      if (!result.error) {
        setLastReceipt({
          items: cart.map(c => ({ name: c.item.name, qty: c.qty, price: (c.item.sellPrice || 0), total: c.qty * (c.item.sellPrice || 0) })),
          total,
          cash: cashNum,
          change,
          date: new Date()
        });
        
        setShowReceipt(true);
        setCart([]);
        setCashProvided("");
        router.refresh();
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
        <div style={{ flex: 1, backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)" }}>
          {/* Header & Search */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#f8fafc", margin: 0 }}>Drinks & Snacks</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#94a3b8", fontSize: "0.875rem" }}>
                <span>{filteredItems.length} items</span>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Search drinks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", outline: "none", fontSize: "0.875rem", color: "#f8fafc" }}
            />
          </div>

          {/* Product Grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", backgroundColor: "#0f172a" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", userSelect: "none" }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#f59e0b"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#334155"}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f8fafc", marginBottom: "0.5rem", minHeight: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "0.5rem" }}>
                    ${((item.sellPrice || 0)).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    Stock: {item.currentStock}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No items match your search.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Cart */}
        <div style={{ width: "380px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", display: "flex", flexDirection: "column", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #334155" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#f8fafc", margin: "0 0 1rem 0" }}>Current Tab</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setShowHistory(true)} style={{ flex: 1, padding: "0.5rem 1rem", backgroundColor: "#f59e0b", border: "none", color: "#0f172a", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}>
                Sales History
              </button>
              <button onClick={() => logoutAction()} style={{ flex: 1, padding: "0.5rem 1rem", backgroundColor: "#334155", border: "none", color: "#f8fafc", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}>
                Logout
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {cart.map(c => (
              <div key={c.item.id} style={{ borderBottom: "1px solid #334155", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#f8fafc" }}>{c.item.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "#f59e0b" }}>${((c.item.sellPrice || 0) * c.qty).toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => updateCartQty(c.item.id, c.qty - 1)} style={{ width: "28px", height: "28px", border: "none", backgroundColor: "#334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>-</button>
                  <input type="text" value={c.qty} readOnly style={{ width: "40px", height: "28px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textAlign: "center", fontSize: "0.875rem" }} />
                  <button onClick={() => updateCartQty(c.item.id, c.qty + 1)} style={{ width: "28px", height: "28px", border: "none", backgroundColor: "#334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>+</button>
                  <button onClick={() => removeFromCart(c.item.id)} style={{ width: "28px", height: "28px", border: "none", backgroundColor: "#ef4444", color: "white", borderRadius: "6px", cursor: "pointer", marginLeft: "auto" }}>×</button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "2rem" }}>Tab is empty</div>}
          </div>

          <div style={{ padding: "1.5rem", backgroundColor: "#0f172a", borderTop: "1px solid #334155", borderRadius: "0 0 12px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.125rem", color: "#94a3b8" }}>Total Due:</span>
              <span style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#f59e0b" }}>${total.toFixed(2)}</span>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Cash Tendered:</label>
              <input 
                type="number" 
                value={cashProvided} 
                onChange={(e) => setCashProvided(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", padding: "0.75rem", border: "1px solid #475569", backgroundColor: "#1e293b", color: "white", borderRadius: "8px", textAlign: "right", outline: "none", fontSize: "1.125rem" }}
              />
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={cart.length === 0 || loading}
              style={{ width: "100%", padding: "1rem", backgroundColor: cart.length === 0 ? "#475569" : "#f59e0b", color: cart.length === 0 ? "#94a3b8" : "#0f172a", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.125rem", cursor: cart.length === 0 ? "not-allowed" : "pointer", transition: "background-color 0.2s" }}
            >
              {loading ? "Processing..." : "PAY NOW"}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastReceipt && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#1e293b", width: "360px", borderRadius: "12px", border: "1px solid #334155", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "2rem", flex: 1, overflowY: "auto", fontFamily: "monospace", color: "#f8fafc" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "#f59e0b" }}>{farmName} - Bar</h3>
                <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Tax Invoice</div>
                <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Date: {lastReceipt.date.toLocaleString()}</div>
                <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Bartender: {userName}</div>
              </div>
              
              <div style={{ borderTop: "1px dashed #475569", borderBottom: "1px dashed #475569", padding: "1rem 0", margin: "1rem 0" }}>
                {lastReceipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                    <span style={{ flex: 1 }}>{item.qty}x {item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.125rem", marginBottom: "0.5rem", color: "#f59e0b" }}>
                <span>TOTAL DUE</span>
                <span>${lastReceipt.total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#94a3b8" }}>
                <span>CASH TENDERED</span>
                <span>${lastReceipt.cash.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: "bold" }}>
                <span>CHANGE</span>
                <span>${lastReceipt.change.toFixed(2)}</span>
              </div>
              
              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.875rem", color: "#94a3b8" }}>
                Cheers! Have a great day.
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #334155", padding: "1.5rem", gap: "1rem", backgroundColor: "#0f172a" }}>
              <button onClick={() => setShowReceipt(false)} style={{ flex: 1, padding: "0.75rem", border: "1px solid #475569", backgroundColor: "#1e293b", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Close Tab</button>
              <button onClick={() => { alert("Printing Receipt..."); setShowReceipt(false); }} style={{ flex: 1, padding: "0.75rem", border: "none", backgroundColor: "#f59e0b", color: "#0f172a", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Print Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#1e293b", width: "600px", maxHeight: "80vh", borderRadius: "12px", border: "1px solid #334155", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>Recent Sales History</h2>
              <button onClick={() => setShowHistory(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.25rem" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              {recentSales.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>No recent sales found for the Bar.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {recentSales.map(sale => (
                    <div key={sale.id} style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: "bold", color: "#f8fafc" }}>{sale.invoiceNumber}</span>
                        <span style={{ color: "#f59e0b", fontWeight: "bold" }}>${sale.totalAmount.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.75rem" }}>
                        {new Date(sale.date).toLocaleString()}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                        {sale.lines.map((line: any) => (
                          <div key={line.id} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{line.quantity}x {line.description.split("x")[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
