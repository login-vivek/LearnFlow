/**
 * General utility helpers
 */

/**
 * Get user initials for avatar fallback.
 * "John Doe" → "JD"
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * Format an ISO date string to a human-readable relative label.
 * e.g. "2026-08-10" → "Yesterday"
 */
export function formatRelativeDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns a Tailwind color class for a skill score.
 */
export function scoreColor(score) {
  if (score >= 75) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

/**
 * Returns a Tailwind bg + text class for a difficulty badge.
 */
export function difficultyBadge(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'intermediate':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'advanced':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  }
}

/**
 * Truncate a string to maxLen characters with ellipsis.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}
