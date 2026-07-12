import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export type BadgeColor = 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'purple' | 'teal' | 'yellow';
export type BadgeVariant = 'soft' | 'outline';

export interface BadgeProps {
  color?: BadgeColor;
  variant?: BadgeVariant;
  /** Show a coloured dot before the label */
  dot?: boolean;
  /** Optional icon rendered before the label (e.g. a checkmark SVG) */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  color = 'gray',
  variant = 'soft',
  dot = false,
  icon,
  children,
  className,
}) => (
  <span className={cn(styles.badge, styles[variant], styles[color], className)}>
    {dot && <span className={styles.dot} aria-hidden="true" />}
    {icon && <span className={styles.iconSlot} aria-hidden="true">{icon}</span>}
    {children}
  </span>
);
