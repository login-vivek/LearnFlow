import React from 'react';
import { Construction } from 'lucide-react';

const PHASE_LABELS = {
  2: 'Phase 2 — Topics & Quizzes',
  3: 'Phase 3 — Knowledge Tracking',
  4: 'Phase 4 — Recommendation Engine',
  5: 'Phase 5 — Adaptive Learning',
  6: 'Phase 6 — Spaced Repetition',
};

export default function ComingSoonPage({ title, phase }) {
  const phaseLabel = PHASE_LABELS[phase] || `Phase ${phase}`;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
        <Construction className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-3 max-w-sm">
        This feature is being built and will be available in the next phase of development.
      </p>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
        Coming in {phaseLabel}
      </span>
    </div>
  );
}
