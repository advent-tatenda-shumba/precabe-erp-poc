'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  /** Optional count pill displayed alongside the label */
  count?: number;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
}

export type TabsVariant = 'underline' | 'pills';

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  /** Visual style of the tab bar. Default: 'underline' */
  variant?: TabsVariant;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => (
  <div
    className={cn(
      variant === 'pills' ? styles.pills : styles.tabBar,
      className
    )}
    role="tablist"
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        aria-selected={tab.id === activeTab}
        className={cn(styles.tab, tab.id === activeTab && styles.active)}
        onClick={() => onChange(tab.id)}
      >
        {tab.icon && (
          <span className={styles.tabIcon} aria-hidden="true">
            {tab.icon}
          </span>
        )}
        {tab.label}
        {tab.count !== undefined && (
          <span className={styles.count} aria-label={`${tab.count} items`}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);
