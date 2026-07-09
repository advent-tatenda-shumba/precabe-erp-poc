import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Alert.module.css';

export type AlertVariant = 'warning' | 'danger' | 'success' | 'info';

const DEFAULT_ICONS: Record<AlertVariant, string> = {
  warning: '⚠️',
  danger:  '🚫',
  success: '✅',
  info:    'ℹ️',
};

export interface AlertProps {
  variant: AlertVariant;
  /** Override the default emoji icon, or pass `null` to hide it */
  icon?: React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant, icon, children, className }) => (
  <div className={cn(styles.alert, styles[variant], className)} role="alert">
    {icon !== null && (
      <span className={styles.icon} aria-hidden="true">
        {icon ?? DEFAULT_ICONS[variant]}
      </span>
    )}
    <div>{children}</div>
  </div>
);
