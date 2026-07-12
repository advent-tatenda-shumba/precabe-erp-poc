import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wisdom ERP — Pricabe Enterprises",
  description: "Integrated ERP System for Pricabe Enterprises (Pvt) Ltd",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
