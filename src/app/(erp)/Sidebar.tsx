"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SettingsPanel from "../_components/SettingsPanel";
import { logoutAction } from "../_actions/auth";
import {
  IconHome, IconChart, IconSprout, IconCow, IconBox, IconBread,
  IconCart, IconDollar, IconUsers, IconBook, IconTrendingUp,
  IconTruck, IconGear, IconLogOut, IconMenu, IconX, IconBuilding,
  IconHandshake, IconBarChart, IconFactory, IconAlert
} from "../_components/Icons";

interface NavUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NavGroup {
  label: string;
  items: { name: string; icon: React.ReactNode; path: string }[];
}

export default function Sidebar({ user }: { user: NavUser | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();
  const pathname = usePathname();

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", icon: <IconHome />, path: "/" },
        { name: "Reports", icon: <IconChart />, path: "/reports" },
      ],
    },
    {
      label: "Operations",
      items: [
        { name: "Agriculture", icon: <IconSprout />, path: "/agriculture" },
        { name: "Livestock", icon: <IconCow />, path: "/livestock" },
        { name: "Inventory", icon: <IconBox />, path: "/inventory" },
        { name: "Manufacturing", icon: <IconFactory />, path: "/manufacturing" },
        { name: "Shrinkage & Loss", icon: <IconAlert />, path: "/shrinkage" },
      ],
    },
    {
      label: "Commerce",
      items: [
        { name: "Purchasing", icon: <IconTruck />, path: "/purchasing" },
        { name: "Sales", icon: <IconDollar />, path: "/sales" },
        { name: "CRM", icon: <IconHandshake />, path: "/crm" },
        { name: "Address Book", icon: <IconBook />, path: "/address-book" },
        { name: "Till Reconciliation", icon: <IconDollar />, path: "/pos-reconciliation" },
      ],
    },
    {
      label: "Finance",
      items: [
        { name: "Financial Accounting", icon: <IconDollar />, path: "/accounting" },
        { name: "Cost Accounting", icon: <IconBarChart />, path: "/cost-accounting" },
        { name: "Fixed Assets", icon: <IconBuilding />, path: "/fixed-assets" },
      ],
    },
    {
      label: "HR & Admin",
      items: [
        { name: "HRM", icon: <IconUsers />, path: "/hrm" },
        { name: "Payroll", icon: <IconCart />, path: "/payroll" },
        { name: "Setup", icon: <IconGear />, path: "/setup" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-header">
        <div className="sidebar-header" style={{ marginBottom: 0, border: "none", padding: 0 }}>
          <div className="logo-icon">W</div>
          <div>
            <h2 style={{ fontSize: "1rem" }}>Wisdom ERP</h2>
          </div>
        </div>
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <IconX size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`erp-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header desktop-only">
          <div className="logo-icon">W</div>
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
                  onClick={() => setIsOpen(false)}
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
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <strong>{user?.name ?? "Unknown"}</strong>
              <span>{user?.role ?? "—"}</span>
            </div>
          </button>

          <form action={logoutAction} style={{ marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={loggingOut}
              className="logout-btn"
            >
              <IconLogOut size={15} />
              {loggingOut ? "Signing out…" : "Sign Out"}
            </button>
          </form>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
    </>
  );
}
