export default function Badge({ difficulty, className = '' }) {
  const map = {
    Easy:   'badge-easy',
    Medium: 'badge-medium',
    Hard:   'badge-hard',
  };
  return (
    <span className={`${map[difficulty] || 'bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full'} ${className}`}>
      {difficulty}
    </span>
  );
}
