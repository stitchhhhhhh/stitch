function getDaysLabel(deadline) {
  const today = new Date();
  const due = new Date(deadline);
  const diffMs = due - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'Overdue', style: 'bg-red-50 border-red-100 text-red-600' };
  if (diffDays <= 3) return { label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`, style: 'bg-red-50 border-red-100 text-red-500' };
  if (diffDays <= 7) return { label: `Due in ${diffDays} days`, style: 'bg-brand-50 border-brand-100 text-brand-600' };
  return { label: `Due in ${diffDays} days`, style: 'bg-gray-50 border-gray-100 text-gray-500' };
}

export default function UpcomingDeadlines({ deadlines = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Upcoming Deadlines</h3>

      {deadlines.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No upcoming deadlines 🎉</p>
      ) : (
        <ul className="space-y-3">
          {deadlines.map((item) => {
            const { label, style } = getDaysLabel(item.deadline);
            return (
              <li
                key={item.course_id}
                className={`rounded-xl border p-3 ${style}`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.course_title}</p>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}