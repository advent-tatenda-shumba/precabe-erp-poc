import type { Metadata } from "next";
import "../globals.css";
import ToastProvider from "../_components/ToastProvider";

export const metadata: Metadata = {
  title: "Fuel Dispatch — Precabe ERP",
  description: "Fuel Dispatch and Management",
};

export default function FuelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </div>
  );
}
