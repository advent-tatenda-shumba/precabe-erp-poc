import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "./Sidebar";
import ToastProvider from "../_components/ToastProvider";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Wisdom ERP — Pricabe Enterprises",
  description: "Integrated ERP System for Pricabe Enterprises (Pvt) Ltd",
};

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const navUser = user
    ? { id: user.id, name: user.name, email: user.email, role: user.role }
    : null;

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="erp-container">
            <Sidebar user={navUser} />

            <main className="erp-main">
              <header className="erp-header">
                <div className="header-title">
                  <h1>Pricabe Enterprises ERP</h1>
                  <p>Wisdom ERP · Multi-Farm Agribusiness Management</p>
                </div>
                <div className="header-actions">
                  <span className="header-badge">Zimbabwe</span>
                </div>
              </header>

              <div className="erp-content">
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
