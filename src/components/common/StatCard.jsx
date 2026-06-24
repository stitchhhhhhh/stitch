export default function StatCard({ label, value, trend, accent = 'brand' }) {
  const accentClasses = {
    brand: 'text-brand-600 bg-brand-50',
    green: 'text-green-600 bg-green-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="flex items-end justify-between mt-1">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${accentClasses[accent]}`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
