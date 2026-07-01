"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Setup & Config", icon: "⚙️", path: "/setup" },
    { name: "Address Book", icon: "📖", path: "/address-book" },
    { name: "Purchasing", icon: "🛍️", path: "/purchasing" },
    { name: "Inventory", icon: "📦", path: "/inventory" },
    { name: "CRM", icon: "🤝", path: "/crm" },
    { name: "Sales", icon: "💰", path: "/sales" },
    { name: "Cost Accounting", icon: "🏦", path: "/cost-accounting" },
    { name: "Fixed Assets", icon: "🏗️", path: "/fixed-assets" },
    { name: "Payroll & HR", icon: "👥", path: "/payroll" },
  ];

  return (
    <>
      <div className="mobile-header">
        <div className="sidebar-header" style={{ marginBottom: 0 }}>
          <span className="logo-icon">W</span>
          <h2>Wisdom</h2>
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <aside className={`erp-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header desktop-only">
          <span className="logo-icon">W</span>
          <h2>Wisdom</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
              onClick={closeMenu}
            >
              <span className="icon">{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JH</div>
            <div className="user-info">
              <strong>Jenny Howard</strong>
              <span>jenny@howard.com</span>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}
    </>
  );
}
