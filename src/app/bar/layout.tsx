import React from "react";

export default function BarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }}>
      {children}
    </div>
  );
}
