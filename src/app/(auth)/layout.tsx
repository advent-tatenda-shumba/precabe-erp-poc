import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sign In — Wisdom ERP",
  description: "Pricabe Enterprises ERP login portal",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
