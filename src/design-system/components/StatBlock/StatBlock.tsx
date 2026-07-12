import React from 'react';
import { cn } from '../../utils/cn';
import styles from './StatBlock.module.css';

export interface StatItem {
  label: string;
  value: string | number;
  /** Secondary note below the value */
  sub?: string;
  /** Highlights the value in the accent colour */
  accent?: boolean;
}

export interface StatBlockProps {
  stats: StatItem[];
  className?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({ stats, className }) => (
  <div className={cn(styles.row, className)}>
    {stats.map((stat) => (
      <div key={stat.label} className={cn(styles.block, stat.accent && styles.accent)}>
        <div className={styles.label}>{stat.label}</div>
        <div className={styles.value}>{stat.value}</div>
        {stat.sub && <div className={styles.sub}>{stat.sub}</div>}
      </div>
    ))}
  </div>
);
