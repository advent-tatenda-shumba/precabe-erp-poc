"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
let globalSetToasts: ((fn: (t: Toast[]) => Toast[]) => void) | null = null;

export function showToast(message: string, type: Toast["type"] = "success") {
  if (globalSetToasts) {
    const id = ++toastId;
    globalSetToasts(t => [...t, { id, message, type }]);
    setTimeout(() => {
      globalSetToasts?.(t => t.filter(x => x.id !== id));
    }, 3500);
  }
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    globalSetToasts = setToasts;
    return () => { globalSetToasts = null; };
  }, []);

  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
