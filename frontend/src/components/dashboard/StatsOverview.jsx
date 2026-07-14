import { ClipboardList, CheckCircle2, Star, Award } from 'lucide-react';

const STATS = [
  { key: 'assigned', label: 'ASSIGNED', icon: ClipboardList, accent: 'text-brand-600 bg-brand-50' },
  { key: 'completed', label: 'COMPLETED', icon: CheckCircle2, accent: 'text-green-600 bg-green-50' },
  { key: 'points', label: 'TOTAL POINTS', icon: Star, accent: 'text-amber-600 bg-amber-50' },
  { key: 'certificates', label: 'CERTIFICATES', icon: Award, accent: 'text-gray-500 bg-gray-100' },
];

export default function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(({ key, label, icon: Icon, accent }) => (
        <div
          key={key}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof stats[key] === 'number' ? stats[key].toLocaleString() : stats[key] ?? 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}