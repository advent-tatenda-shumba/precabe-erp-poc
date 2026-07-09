/**
 * Precabe ERP — Design System
 * ───────────────────────────
 * Single entry point for all design system components.
 *
 * Usage:
 *   import { Button, Card, Badge } from '@/design-system';
 */

/* ── Button ─────────────────────────────── */
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

/* ── Badge ──────────────────────────────── */
export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeColor } from './components/Badge/Badge';

/* ── Card ───────────────────────────────── */
export { Card, CardHeader } from './components/Card/Card';
export type { CardProps, CardHeaderProps, CardAccent, CardPadding } from './components/Card/Card';

/* ── Input / Select / Textarea ──────────── */
export { Input, Select, Textarea } from './components/Input/Input';
export type { InputProps, SelectProps, TextareaProps } from './components/Input/Input';

/* ── FormGroup ──────────────────────────── */
export { FormGroup } from './components/FormGroup/FormGroup';
export type { FormGroupProps } from './components/FormGroup/FormGroup';

/* ── Table ──────────────────────────────── */
export { Table } from './components/Table/Table';
export type { TableProps, Column } from './components/Table/Table';

/* ── Tabs ───────────────────────────────── */
export { Tabs } from './components/Tabs/Tabs';
export type { TabsProps, TabItem } from './components/Tabs/Tabs';

/* ── Modal ──────────────────────────────── */
export { Modal } from './components/Modal/Modal';
export type { ModalProps, ModalSize } from './components/Modal/Modal';

/* ── PageHeader ─────────────────────────── */
export { PageHeader } from './components/PageHeader/PageHeader';
export type { PageHeaderProps } from './components/PageHeader/PageHeader';

/* ── StatBlock ──────────────────────────── */
export { StatBlock } from './components/StatBlock/StatBlock';
export type { StatBlockProps, StatItem } from './components/StatBlock/StatBlock';

/* ── Alert ──────────────────────────────── */
export { Alert } from './components/Alert/Alert';
export type { AlertProps, AlertVariant } from './components/Alert/Alert';

/* ── Utility ────────────────────────────── */
export { cn } from './utils/cn';
