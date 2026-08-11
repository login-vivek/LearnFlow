import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        {/* Logo mark */}
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M4 18L12 6L20 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Spinner */}
        <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading LearnFlow…</p>
      </div>
    </div>
  );
}
