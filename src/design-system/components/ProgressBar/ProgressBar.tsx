import React from 'react';
import { cn } from '../../utils/cn';
import styles from './ProgressBar.module.css';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps {
  value: number;
  max?: number;
  /** Text label shown above the bar */
  label?: string;
  /** Show "value/max" counter on the right */
  showValue?: boolean;
  color?: ProgressBarColor;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'primary',
  className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(styles.fill, styles[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
