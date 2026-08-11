import React from 'react';

const variants = {
  default:      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  primary:      'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  success:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:       'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  beginner:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  advanced:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
