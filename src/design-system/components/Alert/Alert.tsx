import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Alert.module.css';

export type AlertVariant = 'warning' | 'danger' | 'success' | 'info';

/* ── SVG Icons ───────────────────────────── */
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const DangerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  warning: <WarningIcon />,
  danger:  <DangerIcon />,
  success: <SuccessIcon />,
  info:    <InfoIcon />,
};

export interface AlertProps {
  variant: AlertVariant;
  /** Override the default SVG icon, or pass `null` to hide it */
  icon?: React.ReactNode | null;
  /** Full-width banner with no border-radius */
  inline?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant, icon, inline = false, children, className }) => (
  <div
    className={cn(styles.alert, styles[variant], inline && styles.inline, className)}
    role="alert"
  >
    {icon !== null && (
      <span className={styles.icon} aria-hidden="true">
        {icon ?? DEFAULT_ICONS[variant]}
      </span>
    )}
    <div>{children}</div>
  </div>
);
