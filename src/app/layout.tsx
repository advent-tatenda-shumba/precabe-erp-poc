// Root layout is a transparent shell.
// - (auth)/layout.tsx owns html/body/CSS for /login routes
// - (erp)/layout.tsx  owns html/body/CSS for all ERP routes
// This prevents the sidebar from leaking onto the login page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as any;
}
