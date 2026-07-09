'use client';
import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './Toggle.module.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  /** Label rendered beside the toggle */
  label?: string;
  /** Visually hide the label (still accessible to screen readers) */
  labelHidden?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  labelHidden = false,
  className,
}) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(styles.wrapper, disabled && styles.disabled, className)}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={labelHidden ? label : undefined}
        disabled={disabled}
        className={cn(styles.track, checked && styles.on)}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
      {label && (
        <span className={cn(styles.label, labelHidden && styles.srOnly)}>
          {label}
        </span>
      )}
    </label>
  );
};
