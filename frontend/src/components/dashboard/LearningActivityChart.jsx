export default function LearningActivityChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-gray-400">
        No activity data yet.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value ?? d.hours ?? 0), 1);

  return (
    <div className="flex items-end justify-between gap-3 h-44 px-2">
      {data.map((item, idx) => {
        const val = item.value ?? item.hours ?? 0;
        const heightPct = (val / maxVal) * 100;
        const isCurrent = item.isCurrent ?? false;

        return (
          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="w-full flex justify-center h-full items-end">
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                  isCurrent ? 'bg-brand-600' : 'bg-brand-200'
                }`}
                style={{ height: `${heightPct}%` }}
                title={`${val}h`}
              />
            </div>
            <span
              className={`mt-2 text-[10px] font-semibold tracking-wide text-center ${
                isCurrent ? 'text-brand-700' : 'text-gray-400'
              }`}
            >
              {isCurrent
                ? `${(item.label ?? '').toUpperCase()} (CURRENT)`
                : (item.label ?? '').toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}