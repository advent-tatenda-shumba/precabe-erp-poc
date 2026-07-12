"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/_actions/auth";

export default function PosNavbar({ farmName, userName }: { farmName: string, userName: string }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/pos/dashboard" },
    { name: "Inventory", href: "/pos/inventory" },
    { name: "POS", href: "/pos" },
    { name: "Sales", href: "/pos/sales" },
  ];

  return (
    <div style={{ backgroundColor: "#4f46e5", color: "white", padding: "0 1.5rem", height: "50px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>
        <span>📍 Shop 1: {farmName}</span>
      </div>
      <div style={{ display: "flex", gap: "2rem", fontSize: "0.875rem", alignItems: "center" }}>
        {navLinks.map(link => {
          const isActive = pathname === link.href || (link.href === "/pos" && pathname === "/pos/terminal"); // Handle strict match
          return (
            <Link 
              key={link.name} 
              href={link.href}
              style={{
                textDecoration: "none",
                cursor: "pointer", 
                backgroundColor: isActive ? "white" : "transparent", 
                color: isActive ? "#4f46e5" : "white", 
                padding: "0.25rem 0.75rem", 
                borderRadius: "4px", 
                fontWeight: isActive ? "bold" : "normal",
                opacity: isActive ? 1 : 0.8
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div style={{ fontSize: "0.875rem" }}>
        <button 
          onClick={() => logoutAction()} 
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.8, fontSize: "inherit", fontFamily: "inherit" }}
        >
          Logout ({userName})
        </button>
      </div>
    </div>
  );
}
