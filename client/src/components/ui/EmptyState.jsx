export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-500" />
        </div>
      )}
      <h3 className="text-gray-200 font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
