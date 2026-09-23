'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, orientation = 'horizontal', children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);
    const controlled = value !== undefined;
    const currentTab = controlled ? value : activeTab;
    
    const handleTabChange = (tabValue: string) => {
      if (!controlled) setActiveTab(tabValue);
      onValueChange?.(tabValue);
    };
    
    return (
      <div ref={ref} className={cn('flex', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          
          if (child.type === TabsList) {
            return React.cloneElement(child, { currentTab, onTabChange: handleTabChange });
          }
          
          if (child.type === TabsContent) {
            return React.cloneElement(child, { currentTab });
          }
          
          return child;
        })}
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, currentTab, onTabChange, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1 p-1 bg-muted rounded-xl',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === TabTrigger) {
          const tabValue = child.props.value as string;
          return React.cloneElement(child, {
            isActive: currentTab === tabValue,
            onClick: () => onTabChange(tabValue),
          });
        }
        return child;
      })}
    </div>
  )
);
TabsList.displayName = 'TabsList';

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, value, isActive, onClick, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      value={value}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
TabTrigger.displayName = 'TabTrigger';

interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTab?: string;
  value: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, currentTab, value, children, ...props }, ref) => {
    if (currentTab !== value) return null;
    
    return (
      <div
        ref={ref}
        className={cn('mt-4 animate-fade-in', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabContent.displayName = 'TabContent';

export { Tabs, TabsList, TabTrigger, TabContent };