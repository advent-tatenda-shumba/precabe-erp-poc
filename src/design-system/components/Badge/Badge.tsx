import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export type BadgeColor = 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'purple';

export interface BadgeProps {
  color?: BadgeColor;
  /** Show a coloured dot before the label */
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  color = 'gray',
  dot = false,
  children,
  className,
}) => (
  <span className={cn(styles.badge, styles[color], className)}>
    {dot && <span className={styles.dot} aria-hidden="true" />}
    {children}
  </span>
);
