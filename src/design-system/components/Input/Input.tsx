import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

/* ── Shared field wrapper ───────────────── */
interface FieldWrapperProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label, required, hint, error, id, children, className,
}) => (
  <div className={cn(styles.wrapper, className)}>
    {label && (
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
    )}
    {children}
    {hint && !error && <span className={styles.hint}>{hint}</span>}
    {error          && <span className={styles.error} role="alert">{error}</span>}
  </div>
);

/* ── Input ──────────────────────────────── */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'required'> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, hint, className, wrapperClassName, id, ...rest }, ref) => {
    const inputId = id ?? (label ? `ds-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    return (
      <FieldWrapper label={label} required={required} hint={hint} error={error} id={inputId} className={wrapperClassName}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(styles.input, error && styles.hasError, className)}
          {...rest}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = 'Input';

/* ── Select ─────────────────────────────── */
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'required'> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, required, error, hint, className, wrapperClassName, id, children, ...rest }, ref) => {
    const inputId = id ?? (label ? `ds-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    return (
      <FieldWrapper label={label} required={required} hint={hint} error={error} id={inputId} className={wrapperClassName}>
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(styles.select, error && styles.hasError, className)}
          {...rest}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = 'Select';

/* ── Textarea ───────────────────────────── */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, hint, className, wrapperClassName, id, ...rest }, ref) => {
    const inputId = id ?? (label ? `ds-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    return (
      <FieldWrapper label={label} required={required} hint={hint} error={error} id={inputId} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(styles.textarea, error && styles.hasError, className)}
          {...rest}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = 'Textarea';
