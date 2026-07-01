import type { Metadata } from "next";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wisdom ERP - Pricabe Enterprises",
  description: "Bespoke ERP for Pricabe Enterprises (Pvt) Ltd",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="erp-container">
          <MobileNav />
          
          {/* Main Content */}
          <main className="erp-main">
            <header className="erp-header">
              <div className="header-title">
                <h1>Dashboard</h1>
                <p>Welcome to Pricabe Enterprises ERP System</p>
              </div>
              <div className="header-actions">
                <ThemeToggle />
                <span className="flag-icon">🇿🇼</span>
                <button className="client-btn">Client 1 - Consolidated ˅</button>
              </div>
            </header>
            
            <div className="erp-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
