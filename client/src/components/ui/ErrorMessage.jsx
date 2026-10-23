import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">Unable to load</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-1">
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
