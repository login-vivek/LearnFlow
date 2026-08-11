import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = BookOpen, title = 'Nothing here yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="font-medium text-slate-700 dark:text-slate-300">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
