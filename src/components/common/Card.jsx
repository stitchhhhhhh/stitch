export default function Card({ title, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
