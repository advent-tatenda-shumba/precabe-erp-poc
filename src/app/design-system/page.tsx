'use client';

import React, { useState, useEffect } from 'react';
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
  ProgressBar,
  Select,
  StatBlock,
  Table,
  TagInput,
  Tabs,
  Textarea,
  Toggle,
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
  active:   <Badge color="green"  variant="soft" dot>Active</Badge>,
  pending:  <Badge color="orange" variant="soft" dot>Pending</Badge>,
  inactive: <Badge color="gray"   variant="soft" dot>Inactive</Badge>,
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

const PILLS_DEMO = [
  { id: 'card',      label: 'Card View'      },
  { id: 'calendar',  label: 'Calendar View'  },
  { id: 'floorplan', label: 'Floorplan View' },
];

/* ─────────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────────── */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title, subtitle, children,
}) => (
  <section style={{ marginBottom: '3rem' }}>
    <div style={{ marginBottom: '1.25rem' }}>
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
          margin: 0,
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

const SubLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontFamily: 'var(--ds-font-body)',
    fontSize: 'var(--ds-text-xs)',
    fontWeight: 600,
    color: 'var(--ds-text-disabled)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '1rem 0 0.5rem',
  }}>
    {children}
  </p>
);

/* ─────────────────────────────────────────────────────────────
   Colour Swatch
───────────────────────────────────────────────────────────── */
const SwatchRow: React.FC<{ label: string; swatches: { stop: string; hex: string }[] }> = ({ label, swatches }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <div style={{
      fontFamily: 'var(--ds-font-body)',
      fontSize: 'var(--ds-text-xs)',
      fontWeight: 600,
      color: 'var(--ds-text-secondary)',
      marginBottom: '0.4rem',
      textTransform: 'capitalize',
    }}>
      {label}
    </div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {swatches.map((s) => (
        <div
          key={s.stop}
          title={s.hex}
          style={{
            width: 52,
            height: 36,
            background: s.hex,
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  </div>
);

const PRIMARY_RAMP = [
  { stop: '50',  hex: '#f0fdf4' }, { stop: '100', hex: '#CDEDB3' },
  { stop: '200', hex: '#a7e08a' }, { stop: '300', hex: '#85d16a' },
  { stop: '400', hex: '#CEF17B' }, { stop: '500', hex: '#b8d96a' },
  { stop: '600', hex: '#6aaf44' }, { stop: '700', hex: '#2e7a35' },
  { stop: '800', hex: '#0f5c3a' }, { stop: '900', hex: '#084734' },
];
const ORANGE_RAMP = [
  { stop: '50',  hex: '#fff7ed' }, { stop: '100', hex: '#ffedd5' },
  { stop: '200', hex: '#fed7aa' }, { stop: '300', hex: '#fdba74' },
  { stop: '400', hex: '#fb923c' }, { stop: '500', hex: '#f97316' },
  { stop: '600', hex: '#ea580c' }, { stop: '700', hex: '#c2410c' },
  { stop: '800', hex: '#9a3412' }, { stop: '900', hex: '#7c2d12' },
];
const YELLOW_RAMP = [
  { stop: '50',  hex: '#fefce8' }, { stop: '100', hex: '#fef9c3' },
  { stop: '200', hex: '#fef08a' }, { stop: '300', hex: '#fde047' },
  { stop: '400', hex: '#facc15' }, { stop: '500', hex: '#eab308' },
  { stop: '600', hex: '#ca8a04' }, { stop: '700', hex: '#a16207' },
  { stop: '800', hex: '#854d0e' }, { stop: '900', hex: '#713f12' },
];
const RED_RAMP = [
  { stop: '50',  hex: '#fff1f2' }, { stop: '100', hex: '#ffe4e6' },
  { stop: '200', hex: '#fecdd3' }, { stop: '300', hex: '#fda4af' },
  { stop: '400', hex: '#fb7185' }, { stop: '500', hex: '#f43f5e' },
  { stop: '600', hex: '#e11d48' }, { stop: '700', hex: '#be123c' },
  { stop: '800', hex: '#9f1239' }, { stop: '900', hex: '#881337' },
];
const EMERALD_RAMP = [
  { stop: '50',  hex: '#ecfdf5' }, { stop: '100', hex: '#d1fae5' },
  { stop: '200', hex: '#a7f3d0' }, { stop: '300', hex: '#6ee7b7' },
  { stop: '400', hex: '#34d399' }, { stop: '500', hex: '#10b981' },
  { stop: '600', hex: '#059669' }, { stop: '700', hex: '#047857' },
  { stop: '800', hex: '#065f46' }, { stop: '900', hex: '#064e3b' },
];
const SECONDARY_RAMP = [
  { stop: 'Blue',   hex: '#3b82f6' }, { stop: 'Purple', hex: '#9333ea' },
  { stop: 'Pink',   hex: '#ec4899' }, { stop: 'Cyan',   hex: '#06b6d4' },
  { stop: 'Gray',   hex: '#94a3b8' },
];

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function DesignSystemPage() {
  const [activeTab, setActiveTab]       = useState('overview');
  const [activePill, setActivePill]     = useState('card');
  const [modalOpen, setModalOpen]       = useState(false);
  const [loadingBtn, setLoadingBtn]     = useState(false);
  const [tags, setTags]                 = useState<string[]>(['UI Design', 'Ux Design']);
  const [toggled, setToggled]           = useState(true);
  const [isDark, setIsDark]             = useState(false);

  /* Apply / remove dark theme on the root element */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    return () => root.removeAttribute('data-theme');
  }, [isDark]);

  const handleLoadingDemo = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ds-bg)',
      fontFamily: 'var(--ds-font-body)',
    }}>
      {/* ── Dark mode toggle (floating) ───── */}
      <button
        onClick={() => setIsDark((d) => !d)}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isDark ? '#1e293b' : '#084734',
          color: isDark ? '#CEF17B' : '#CEF17B',
          border: isDark ? '1px solid #334155' : '1px solid #063828',
          borderRadius: '999px',
          padding: '0.45rem 1rem',
          fontFamily: 'var(--ds-font-body)',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          transition: 'all 150ms ease',
          letterSpacing: '0.01em',
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{isDark ? '☀️' : '🌙'}</span>
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>
      {/* ── Hero header ──────────────────────── */}
      <header style={{
        background: 'linear-gradient(135deg, #052b1f 0%, #084734 55%, #0f5c3a 100%)',
        padding: '3rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(206,241,123,0.10)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: '30%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(205,237,179,0.08)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(206,241,123,0.12)',
            border: '1px solid rgba(206,241,123,0.30)',
            borderRadius: 'var(--ds-radius-full)',
            padding: '0.3rem 0.85rem', marginBottom: '1.25rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CEF17B', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--ds-font-body)', fontSize: '0.72rem', fontWeight: 700, color: '#CEF17B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Design System
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--ds-font-body)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, color: '#fff',
            marginBottom: '0.75rem', lineHeight: 1.1,
          }}>
            Precabe ERP
            <span style={{ display: 'block', color: '#CEF17B' }}>Component Library</span>
          </h1>
          <p style={{
            fontFamily: 'var(--ds-font-body)',
            fontSize: 'var(--ds-text-md)',
            color: 'rgba(205,237,179,0.85)',
            maxWidth: 560, lineHeight: 1.6, margin: 0,
          }}>
            A centralised, token-driven design system. Preview all components here before
            injecting them into the ERP application.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: '14 Components', icon: '🧩' },
              { label: 'Dark Mode',     icon: '🌙' },
              { label: 'Fully Typed',   icon: '⚡' },
              { label: 'CSS Modules',   icon: '🎨' },
            ].map((chip) => (
              <div key={chip.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(206,241,123,0.20)',
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

        {/* ── Colour Palette ────────────────── */}
        <Section title="Colour Palette" subtitle="Full 10-stop ramps for all brand and semantic colours. Every component consumes --ds-* tokens.">
          <Card padding="md">
            <SwatchRow label="Primary (Pine → Lime Glow → Green Tea)" swatches={PRIMARY_RAMP} />
            <SwatchRow label="Orange"           swatches={ORANGE_RAMP}  />
            <SwatchRow label="Yellow"           swatches={YELLOW_RAMP}  />
            <SwatchRow label="Red"              swatches={RED_RAMP}     />
            <SwatchRow label="Emerald"          swatches={EMERALD_RAMP} />
            <SwatchRow label="Secondary (Blue · Purple · Pink · Cyan · Gray)" swatches={SECONDARY_RAMP} />
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
        <Section title="Button" subtitle="Four variants × four sizes, optional icon slot, loading state.">
          <Card padding="md">
            <SubLabel>Variants</SubLabel>
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Row>

            <SubLabel>Sizes (xs · sm · md · lg)</SubLabel>
            <Row style={{ alignItems: 'center' }}>
              <Button size="xs">Tiny</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>

            <SubLabel>With icon</SubLabel>
            <Row>
              <Button size="lg" icon={<span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>}>Large Button</Button>
              <Button size="md" icon={<span style={{ fontSize: '0.9rem', lineHeight: 1 }}>+</span>}>Medium Button</Button>
              <Button size="sm" icon={<span style={{ fontSize: '0.8rem', lineHeight: 1 }}>+</span>}>Small Button</Button>
              <Button size="xs" icon={<span style={{ fontSize: '0.7rem', lineHeight: 1 }}>+</span>}>Tiny</Button>
            </Row>

            <SubLabel>States</SubLabel>
            <Row>
              <Button loading={loadingBtn} onClick={handleLoadingDemo}>
                {loadingBtn ? 'Saving...' : 'Click to load'}
              </Button>
              <Button disabled>Disabled</Button>
            </Row>
          </Card>
        </Section>

        {/* ── Badges ────────────────────────── */}
        <Section title="Badge" subtitle="Soft fill and outline variants across 8 colour options.">
          <Card padding="md">
            <SubLabel>Soft (default)</SubLabel>
            <Row>
              <Badge color="green"  variant="soft" dot>Active</Badge>
              <Badge color="orange" variant="soft" dot>Pending</Badge>
              <Badge color="red"    variant="soft" dot>Alert</Badge>
              <Badge color="blue"   variant="soft" dot>In Review</Badge>
              <Badge color="gray"   variant="soft" dot>Archived</Badge>
              <Badge color="purple" variant="soft" dot>Draft</Badge>
              <Badge color="teal"   variant="soft">Teal</Badge>
              <Badge color="yellow" variant="soft">Yellow</Badge>
            </Row>
            <SubLabel>Outline</SubLabel>
            <Row>
              <Badge color="green"  variant="outline">Confirmed</Badge>
              <Badge color="orange" variant="outline">Waiting</Badge>
              <Badge color="red"    variant="outline">Alert</Badge>
              <Badge color="blue"   variant="outline">Info</Badge>
              <Badge color="gray"   variant="outline">Closed</Badge>
              <Badge color="purple" variant="outline">Draft</Badge>
            </Row>
          </Card>
        </Section>

        {/* ── Tabs ──────────────────────────── */}
        <Section title="Tabs" subtitle="Two visual variants: underline (default) and pills (segmented control).">
          <Card padding="md" style={{ marginBottom: '1rem' }}>
            <SubLabel>Underline (default)</SubLabel>
            <Tabs tabs={TABS_DEMO} activeTab={activeTab} onChange={setActiveTab} />
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--ds-surface-raised)',
              borderRadius: 'var(--ds-radius-md)',
              fontFamily: 'var(--ds-font-body)',
              fontSize: 'var(--ds-text-sm)',
              color: 'var(--ds-text-secondary)',
            }}>
              Active tab: <strong style={{ color: 'var(--ds-accent-on-surface)' }}>{activeTab}</strong>
            </div>
          </Card>

          <Card padding="md">
            <SubLabel>Pills (segmented control)</SubLabel>
            <div style={{ marginTop: '0.5rem' }}>
              <Tabs tabs={PILLS_DEMO} activeTab={activePill} onChange={setActivePill} variant="pills" />
            </div>
          </Card>
        </Section>

        {/* ── Alert ─────────────────────────── */}
        <Section title="Alert" subtitle="SVG icon, slim left-border banner style. Add inline prop for full-width no-radius variant.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Alert variant="success">Staff payroll for June has been successfully processed and submitted.</Alert>
            <Alert variant="info">System maintenance is scheduled for Saturday 22:00 – 02:00.</Alert>
            <Alert variant="warning">3 purchase orders are awaiting approval before the deadline.</Alert>
            <Alert variant="danger">Failed to sync livestock data. Please check your connection and retry.</Alert>
            <Alert variant="danger" inline>You cannot request a booking in the past!</Alert>
          </div>
        </Section>

        {/* ── Cards ─────────────────────────── */}
        <Section title="Card" subtitle="Surface container with optional accent stripe, padding variants, and hover animation.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {(['none','green','orange','red','blue'] as const).map((accent) => (
              <Card key={accent} accent={accent} padding="md">
                <CardHeader title={accent === 'none' ? 'Default' : accent.charAt(0).toUpperCase() + accent.slice(1)} />
                <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', margin: 0 }}>
                  accent=&quot;{accent}&quot;
                </p>
              </Card>
            ))}
            <Card accent="default" padding="md" hoverable as="a" href="#">
              <CardHeader title="Hoverable" />
              <p style={{ fontFamily: 'var(--ds-font-body)', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', margin: 0 }}>
                hoverable + as=&quot;a&quot;
              </p>
            </Card>
          </div>
        </Section>

        {/* ── Input / Select / Textarea ──────── */}
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

        {/* ── TagInput ──────────────────────── */}
        <Section title="TagInput" subtitle="Chip-style tag input. Press Enter or comma to add. Backspace removes last tag.">
          <Card padding="md">
            <TagInput
              label="Tags"
              tags={tags}
              onAdd={(t) => setTags((prev) => [...prev, t])}
              onRemove={(t) => setTags((prev) => prev.filter((x) => x !== t))}
              placeholder="Add tag…"
            />
          </Card>
        </Section>

        {/* ── ProgressBar ───────────────────── */}
        <Section title="ProgressBar" subtitle="Inline animated progress bar. Four colour variants, optional label and value counter.">
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ProgressBar label="All day pass"     value={6}  max={10} showValue color="primary" />
              <ProgressBar label="Booking credits"  value={8}  max={20} showValue color="primary" />
              <ProgressBar label="Storage usage"    value={72} max={100} showValue color="warning" />
              <ProgressBar label="Overdue invoices" value={5}  max={5}  showValue color="danger"  />
              <ProgressBar label="Deliveries"       value={18} max={20} showValue color="success" />
            </div>
          </Card>
        </Section>

        {/* ── Toggle ────────────────────────── */}
        <Section title="Toggle" subtitle="iOS-style switch with role=switch, keyboard support, and label slot.">
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Toggle checked={toggled} onChange={setToggled} label="Apple Calendar integration" />
              <Toggle checked={false} onChange={() => {}} label="Email notifications" />
              <Toggle checked={true}  onChange={() => {}} label="Disabled (on)"  disabled />
              <Toggle checked={false} onChange={() => {}} label="Disabled (off)" disabled />
            </div>
          </Card>
        </Section>

        {/* ── Table ─────────────────────────── */}
        <Section title="Table" subtitle="Generic typed component — columns defined declaratively, custom cell renderers supported.">
          <Card padding="none">
            <div style={{ padding: 'var(--ds-space-5) var(--ds-space-5) 0' }}>
              <CardHeader
                title="Staff Directory"
                actions={<Button size="sm" icon={<span>+</span>}>Add Staff</Button>}
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
                <option>Seeds &amp; Fertilisers</option>
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
                  <Button size="sm" icon={<span>+</span>}>Add Item</Button>
                </>
              }
            />
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
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
        Precabe ERP Design System — preview only ·{' '}
        <a href="/erp" style={{ color: 'var(--ds-accent-on-surface)' }}>Back to app</a>
      </footer>
    </div>
  );
}
