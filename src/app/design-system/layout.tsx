import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Design System — Precabe ERP",
  description: "Preview all components here before injecting them into the ERP application.",
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
