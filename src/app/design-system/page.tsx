'use client';

import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  FormGroup,
  Input,
  Modal,
  PageHeader,
  Select,
  StatBlock,
  Table,
  Tabs,
  Textarea,
} from '@/design-system';
import type { Column } from '@/design-system';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface SampleRow {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  amount: string;
}

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const SAMPLE_ROWS: SampleRow[] = [
  { id: 1, name: 'Sipho Dlamini',    role: 'Field Manager',   status: 'active',   amount: 'R 12,400' },
  { id: 2, name: 'Aisha Mokoena',   role: 'Agronomist',      status: 'active',   amount: 'R 9,800'  },
  { id: 3, name: 'Thabang Nkosi',   role: 'HR Officer',      status: 'pending',  amount: 'R 8,200'  },
  { id: 4, name: 'Lindiwe Sithole', role: 'Accountant',      status: 'inactive', amount: 'R 11,000' },
];

const STATUS_BADGE: Record<SampleRow['status'], React.ReactNode> = {
  active:   <Badge color="green"  dot>Active</Badge>,
  pending:  <Badge color="orange" dot>Pending</Badge>,
  inactive: <Badge color="gray"   dot>Inactive</Badge>,
};

const TABLE_COLUMNS: Column<SampleRow>[] = [
  { key: 'name',   header: 'Name' },
  { key: 'role',   header: 'Role' },
  { key: 'status', header: 'Status', render: (row) => STATUS_BADGE[row.status] },
  { key: 'amount', header: 'Amount', align: 'right' },
  { key: 'action', header: '', align: 'right', render: () => <Button variant="ghost" size="sm">View</Button> },
];

const TABS_DEMO = [
  { id: 'overview',  label: 'Overview',  count: 12 },
  { id: 'active',    label: 'Active',    count: 8  },
  { id: 'pending',   label: 'Pending',   count: 3  },
  { id: 'archived',  label: 'Archived'            },
];

/* ─────────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────────── */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title, subtitle, children,
}) => (
  <section style={{ marginBottom: '3rem' }}>
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--ds-font-body)',
        fontSize: 'var(--ds-text-lg)',
        fontWeight: 700,
        color: 'var(--ds-text-primary)',
        marginBottom: '0.25rem',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: 'var(--ds-font-body)',
          fontSize: 'var(--ds-text-sm)',
          color: 'var(--ds-text-secondary)',
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

const Row: React.FC<{ children: React.ReactNode; wrap?: boolean; style?: React.CSSProperties }> = ({ children, wrap = true, style }) => (
  <div style={{
    display: 'flex',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: '0.75rem',
    alignItems: 'center',
    ...style,
  }}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Colour Token Swatch
───────────────────────────────────────────────────────────── */
const Swatch: React.FC<{ name: string; value: string; textColor?: string }> = ({ name, value, textColor = '#fff' }) => (
  <div style={{
    background: value,
    borderRadius: 'var(--ds-radius-lg)',
    padding: '0.75rem 1rem',
    minWidth: 120,
    flex: '1 1 120px',
  }}>
    <div style={{ fontFamily: 'var(--ds-font-body)', fontSize: '0.7rem', fontWeight: 700, color: textColor, opacity: 0.75, marginBottom: 4 }}>
      {name}
    </div>
    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: textColor }}>
      {value}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function DesignSystemPage() {
  const [activeTab, setActiveTab]     = useState('overview');
  const [modalOpen, setModalOpen]     = useState(false);
  const [loadingBtn, setLoadingBtn]   = useState(false);

  const handleLoadingDemo = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ds-bg)',
      backgroundImage: 'var(--ds-bg-gradient)',
      fontFamily: 'var(--ds-font-body)',
    }}>
      {/* ── Hero header ──────────────────────── */}
      <header style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        padding: '3rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'rgba(129,140,248,0.15)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: '30%',
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(196,181,253,0.10)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(165,180,252,0.15)',
            border: '1px solid rgba(165,180,252,0.3)',
            borderRadius: 'var(--ds-radius-full)',
            padding: '0.3rem 0.85rem',
            marginBottom: '1.25rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--ds-font-body)', fontSize: '0.72rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Design System
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--ds-font-body)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}>
            Precabe ERP
            <span style={{ display: 'block', color: '#a5b4fc' }}>Component Library</span>
          </h1>
          <p style={{
            fontFamily: 'var(--ds-font-body)',
            fontSize: 'var(--ds-text-md)',
            color: 'rgba(199,210,254,0.85)',
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            A centralised, token-driven design system. Preview all components here before
            injecting them into the ERP application.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: '11 Components', icon: '🧩' },
              { label: 'Dark Mode',     icon: '🌙' },
              { label: 'Fully Typed',   icon: '⚡' },
              { label: 'CSS Modules',   icon: '🎨' },
            ].map((chip) => (
              <div key={chip.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--ds-radius-full)',
                padding: '0.35rem 0.85rem',
                fontFamily: 'var(--ds-font-body)',
                fontSize: 'var(--ds-text-xs)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
              }}>
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────── */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── Colour Tokens ─────────────────── */}
        <Section title="Colour Tokens" subtitle="Brand, semantic, and surface tokens. Swap the palette here to retheme the whole system.">
          <Card padding="md" style={{ marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>Brand</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Swatch name="--ds-accent"       value="#6366f1" />
              <Swatch name="--ds-accent-hover" value="#4f46e5" />
              <Swatch name="--ds-accent-light" value="#e0e7ff" textColor="#4f46e5" />
            </div>
            <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>Semantic</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Swatch name="--ds-success" value="#10b981" />
              <Swatch name="--ds-warning" value="#f59e0b" />
              <Swatch name="--ds-danger"  value="#ef4444" />
              <Swatch name="--ds-info"    value="#3b82f6" />
            </div>
          </Card>
        </Section>

        {/* ── Stats ─────────────────────────── */}
        <Section title="StatBlock" subtitle="KPI metric rows — pass an array of stats, get a responsive flex row.">
          <StatBlock stats={[
            { label: 'Total Revenue',  value: 'R 2.4M',  sub: '+12% vs last month', accent: true },
            { label: 'Active Jobs',    value: 142                                                 },
            { label: 'Staff',          value: 38,         sub: '4 pending approval'               },
            { label: 'Outstanding',    value: 'R 84K',    sub: '18 invoices'                      },
          ]} />
        </Section>

        {/* ── Buttons ───────────────────────── */}
        <Section title="Button" subtitle="Four variants × three sizes. Loading state spins the internal spinner.">
          <Card padding="md">
            <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>Variants</p>
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Row>
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>Sizes</p>
              <Row>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>States</p>
              <Row>
                <Button loading={loadingBtn} onClick={handleLoadingDemo}>
                  {loadingBtn ? 'Saving...' : 'Click to load'}
                </Button>
                <Button disabled>Disabled</Button>
              </Row>
            </div>
          </Card>
        </Section>

        {/* ── Badges ────────────────────────── */}
        <Section title="Badge" subtitle="Six semantic colour options with an optional dot indicator.">
          <Card padding="md">
            <Row>
              <Badge color="green"  dot>Active</Badge>
              <Badge color="orange" dot>Pending</Badge>
              <Badge color="red"    dot>Overdue</Badge>
              <Badge color="blue"   dot>In Review</Badge>
              <Badge color="gray"   dot>Archived</Badge>
              <Badge color="purple" dot>Draft</Badge>
            </Row>
            <Row style={{ marginTop: '0.75rem' }}>
              <Badge color="green">Active</Badge>
              <Badge color="orange">Pending</Badge>
              <Badge color="red">Overdue</Badge>
              <Badge color="blue">In Review</Badge>
              <Badge color="gray">Archived</Badge>
              <Badge color="purple">Draft</Badge>
            </Row>
          </Card>
        </Section>

        {/* ── Alerts ────────────────────────── */}
        <Section title="Alert" subtitle="Four semantic variants — icon is swappable or removable.">
          <Alert variant="success">Staff payroll for June has been successfully processed and submitted.</Alert>
          <Alert variant="info">System maintenance is scheduled for Saturday 22:00 – 02:00.</Alert>
          <Alert variant="warning">3 purchase orders are awaiting approval before the deadline.</Alert>
          <Alert variant="danger">Failed to sync livestock data. Please check your connection and retry.</Alert>
        </Section>

        {/* ── Cards ─────────────────────────── */}
        <Section title="Card" subtitle="Surface container with optional accent stripe, padding variants, and hover animation.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {(['none','green','orange','red','blue'] as const).map((accent) => (
              <Card key={accent} accent={accent} padding="md">
                <CardHeader title={accent === 'none' ? 'Default' : accent.charAt(0).toUpperCase() + accent.slice(1)} />
                <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)' }}>
                  accent=&quot;{accent}&quot;
                </p>
              </Card>
            ))}
            <Card accent="default" padding="md" hoverable as="a" href="#">
              <CardHeader title="Hoverable" />
              <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)' }}>
                hoverable + as=&quot;a&quot;
              </p>
            </Card>
          </div>
        </Section>

        {/* ── Inputs ────────────────────────── */}
        <Section title="Input / Select / Textarea" subtitle="All three field types share a consistent FieldWrapper with label, hint, and error.">
          <Card padding="md">
            <FormGroup columns={2}>
              <Input label="Full Name" placeholder="e.g. Sipho Dlamini" required />
              <Input label="Email Address" type="email" placeholder="sipho@precabe.co.za" hint="We'll never share your email." />
            </FormGroup>
            <div style={{ marginTop: '1rem' }}>
              <FormGroup columns={2}>
                <Select label="Department" required>
                  <option value="">Select a department</option>
                  <option value="agri">Agriculture</option>
                  <option value="hrm">Human Resources</option>
                  <option value="fin">Finance</option>
                </Select>
                <Input label="Error State" placeholder="Invalid input" error="This field is required." />
              </FormGroup>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Textarea label="Notes" placeholder="Additional context..." rows={3} />
            </div>
          </Card>
        </Section>

        {/* ── Tabs ──────────────────────────── */}
        <Section title="Tabs" subtitle="Horizontally scrollable, ARIA-compliant tab bar with optional count pills.">
          <Card padding="md">
            <Tabs tabs={TABS_DEMO} activeTab={activeTab} onChange={setActiveTab} />
            <div style={{
              padding: '1rem',
              background: 'var(--ds-surface-raised)',
              borderRadius: 'var(--ds-radius-md)',
              fontFamily: 'var(--ds-font-body)',
              fontSize: 'var(--ds-text-base)',
              color: 'var(--ds-text-secondary)',
            }}>
              Active tab: <strong style={{ color: 'var(--ds-accent)' }}>{activeTab}</strong>
            </div>
          </Card>
        </Section>

        {/* ── Table ─────────────────────────── */}
        <Section title="Table" subtitle="Generic typed component — columns defined declaratively, custom cell renderers supported.">
          <Card padding="none">
            <div style={{ padding: 'var(--ds-space-5) var(--ds-space-5) 0' }}>
              <CardHeader
                title="Staff Directory"
                actions={<Button size="sm">+ Add Staff</Button>}
              />
            </div>
            <Table
              columns={TABLE_COLUMNS}
              data={SAMPLE_ROWS}
              keyExtractor={(row) => row.id}
            />
          </Card>
        </Section>

        {/* ── Modal ─────────────────────────── */}
        <Section title="Modal" subtitle="Escape key dismiss, scroll lock, focus management, optional footer slot.">
          <Card padding="md">
            <Row>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <span style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)' }}>
                Also dismisses on overlay click or Escape key
              </span>
            </Row>
          </Card>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Create Purchase Order"
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setModalOpen(false)}>Submit Order</Button>
              </>
            }
          >
            <FormGroup columns={2}>
              <Input label="Supplier" placeholder="e.g. AgriSupply SA" required />
              <Input label="PO Number" placeholder="PO-2024-001" />
            </FormGroup>
            <div style={{ marginTop: '1rem' }}>
              <Select label="Category">
                <option>Seeds & Fertilisers</option>
                <option>Equipment</option>
                <option>Livestock Feed</option>
              </Select>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Textarea label="Description" rows={3} placeholder="Describe the order..." />
            </div>
          </Modal>
        </Section>

        {/* ── PageHeader ────────────────────── */}
        <Section title="PageHeader" subtitle="Standard module page title with optional description and right-aligned actions.">
          <Card padding="md">
            <PageHeader
              title="Inventory Management"
              description="Track stock levels, movements, and valuations across all farm locations."
              actions={
                <>
                  <Button variant="ghost" size="sm">Export</Button>
                  <Button size="sm">+ Add Item</Button>
                </>
              }
            />
            <div style={{
              padding: '1rem',
              background: 'var(--ds-surface-raised)',
              borderRadius: 'var(--ds-radius-md)',
              fontFamily: 'var(--ds-font-body)',
              fontSize: 'var(--ds-text-sm)',
              color: 'var(--ds-text-secondary)',
            }}>
              ↑ PageHeader rendered above
            </div>
          </Card>
        </Section>

      </main>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--ds-border)',
        padding: '1.5rem',
        textAlign: 'center',
        fontFamily: 'var(--ds-font-body)',
        fontSize: 'var(--ds-text-sm)',
        color: 'var(--ds-text-secondary)',
      }}>
        Precabe ERP Design System — preview only · <a href="/erp" style={{ color: 'var(--ds-accent)' }}>Back to app</a>
      </footer>
    </div>
  );
}
