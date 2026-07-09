'use client';
import React, { useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import styles from './TagInput.module.css';

export interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  /** Prevent adding more tags beyond this count */
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  /** Optional label rendered above the input */
  label?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add tag…',
  maxTags,
  disabled = false,
  className,
  label,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const value = inputValue.trim();
    if (!value) return;
    if (maxTags !== undefined && tags.length >= maxTags) return;
    if (!tags.includes(value)) onAdd(value);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={cn(styles.container, disabled && styles.disabled)}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span key={tag} className={styles.chip}>
            {tag}
            {!disabled && (
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
        {(!maxTags || tags.length < maxTags) && !disabled && (
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            placeholder={tags.length === 0 ? placeholder : ''}
            aria-label={placeholder}
          />
        )}
      </div>
    </div>
  );
};
