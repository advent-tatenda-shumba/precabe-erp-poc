import React from 'react';
import { cn } from '../../utils/cn';
import styles from './FormGroup.module.css';

export interface FormGroupProps {
  /** Number of equal-width columns (collapses to 1 on mobile) */
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  columns = 1,
  children,
  className,
}) => (
  <div
    className={cn(
      styles.group,
      columns === 2 && styles.grid2,
      columns === 3 && styles.grid3,
      className
    )}
  >
    {children}
  </div>
);
