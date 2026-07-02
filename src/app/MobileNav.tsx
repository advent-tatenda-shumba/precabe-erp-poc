"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SettingsPanel from "./_components/SettingsPanel";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", icon: "🏠", path: "/" },
        { name: "Reports", icon: "📈", path: "/reports" },
      ],
    },
    {
      label: "Operations",
      items: [
        { name: "Agriculture", icon: "🌾", path: "/agriculture" },
        { name: "Livestock", icon: "🐄", path: "/livestock" },
        { name: "Inventory", icon: "📦", path: "/inventory" },
        { name: "Manufacturing", icon: "🍞", path: "/manufacturing" },
      ],
    },
    {
      label: "Commerce",
      items: [
        { name: "Purchasing", icon: "🛍️", path: "/purchasing" },
        { name: "Sales", icon: "💰", path: "/sales" },
        { name: "CRM", icon: "🤝", path: "/crm" },
        { name: "Address Book", icon: "📖", path: "/address-book" },
      ],
    },
    {
      label: "Finance",
      items: [
        { name: "Cost Accounting", icon: "🏦", path: "/cost-accounting" },
        { name: "Fixed Assets", icon: "🚜", path: "/fixed-assets" },
      ],
    },
    {
      label: "HR & Admin",
      items: [
        { name: "HRM", icon: "👥", path: "/hrm" },
        { name: "Payroll", icon: "💸", path: "/payroll" },
        { name: "Setup", icon: "⚙️", path: "/setup" },
      ],
    },
  ];

  return (
    <>
      <div className="mobile-header">
        <div className="sidebar-header" style={{ marginBottom: 0, border: 'none', padding: 0 }}>
          <span className="logo-icon">W</span>
          <div>
            <h2 style={{ fontSize: '1rem' }}>Wisdom ERP</h2>
          </div>
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <aside className={`erp-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header desktop-only">
          <span className="logo-icon">W</span>
          <div>
            <h2>Wisdom ERP</h2>
            <span className="subtitle">Pricabe Enterprises</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="nav-section-title">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`nav-item ${pathname === item.path ? "active" : ""}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="user-avatar-btn" onClick={() => setIsSettingsOpen(true)}>
            <div className="avatar">JH</div>
            <div className="user-info">
              <strong>Jenny Howard</strong>
              <span>Super Admin</span>
            </div>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
