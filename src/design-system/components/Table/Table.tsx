import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell renderer. Falls back to `String(row[key])`. */
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  minWidth?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  className,
}: TableProps<T>) {
  return (
    <div className={styles.responsive}>
      <table className={cn(styles.table, className)}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  col.align === 'center'
                    ? styles.alignCenter
                    : col.align === 'right'
                    ? styles.alignRight
                    : undefined
                }
                style={col.minWidth ? { minWidth: col.minWidth } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={keyExtractor(row, idx)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.align === 'center'
                        ? styles.alignCenter
                        : col.align === 'right'
                        ? styles.alignRight
                        : undefined
                    }
                  >
                    {col.render
                      ? col.render(row, idx)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
