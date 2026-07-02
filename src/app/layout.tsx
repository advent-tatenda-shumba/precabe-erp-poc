import type { Metadata } from "next";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import ToastProvider from "./_components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wisdom ERP — Pricabe Enterprises",
  description: "Integrated ERP System for Pricabe Enterprises (Pvt) Ltd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="erp-container">
            <MobileNav />

            <main className="erp-main">
            <header className="erp-header">
              <div className="header-title">
                <h1>Pricabe Enterprises ERP</h1>
                <p>Wisdom ERP · Multi-Farm Agribusiness Management</p>
              </div>
              <div className="header-actions">
                <ThemeToggle />
                <span className="flag-icon">🇿🇼</span>
                <button className="client-btn">Consolidated View ˅</button>
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
