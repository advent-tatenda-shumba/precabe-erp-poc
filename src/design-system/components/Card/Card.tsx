import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

export type CardAccent  = 'none' | 'default' | 'green' | 'orange' | 'red' | 'blue' | 'purple';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const ACCENT_CLASS: Record<CardAccent, string> = {
  none:    styles.accentNone,
  default: styles.accentDefault,
  green:   styles.accentGreen,
  orange:  styles.accentOrange,
  red:     styles.accentRed,
  blue:    styles.accentBlue,
  purple:  styles.accentPurple,
};

const PAD_CLASS: Record<CardPadding, string> = {
  none: styles.padNone,
  sm:   styles.padSm,
  md:   styles.padMd,
  lg:   styles.padLg,
};

export interface CardProps {
  accent?: CardAccent;
  padding?: CardPadding;
  /** Adds lift-on-hover animation — useful for link / clickable cards */
  hoverable?: boolean;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const Card: React.FC<CardProps> = ({
  accent = 'none',
  padding = 'md',
  hoverable = false,
  as: Component = 'div',
  children,
  className,
  ...rest
}) => (
  <Component
    className={cn(
      styles.card,
      ACCENT_CLASS[accent],
      PAD_CLASS[padding],
      hoverable && styles.hoverable,
      className
    )}
    {...rest}
  >
    {children}
  </Component>
);

/* ── Sub-component ─────────────────────────────────────────── */
export interface CardHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, actions, className }) => (
  <div className={cn(styles.header, className)}>
    <h3 className={styles.title}>{title}</h3>
    {actions}
  </div>
);
