import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Component Library — Precabe ERP',
  description: 'Design system preview for the Precabe ERP application.',
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
