import { Trophy } from 'lucide-react';

const MEDAL = {
  0: 'bg-amber-100 text-amber-600',
  1: 'bg-gray-100 text-gray-500',
  2: 'bg-orange-100 text-orange-600',
};

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function TopLearners({ leaderboard = [], currentUserId }) {
  const top3 = leaderboard.slice(0, 3);
  const currentUserEntry = leaderboard.find((u) => u.user_id === currentUserId);
  const currentUserRank = leaderboard.findIndex((u) => u.user_id === currentUserId) + 1;
  const isInTop3 = currentUserRank >= 1 && currentUserRank <= 3;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-gray-900">Top Learners</h3>
        <Trophy size={20} className="text-amber-400" />
      </div>

      {top3.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No leaderboard rankings available yet.</p>
      ) : (
        <ul className="space-y-4">
          {top3.map((learner, idx) => (
            <li key={learner.user_id} className="flex items-center gap-3">
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${MEDAL[idx] ?? 'bg-gray-100 text-gray-500'}`}
              >
                {getInitials(learner.full_name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{learner.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{learner.department_name}</p>
              </div>
              <span className="text-sm font-bold text-brand-600 whitespace-nowrap">
                {learner.total_points.toLocaleString()} pts
              </span>
            </li>
          ))}
        </ul>
      )}


      {currentUserEntry && !isInTop3 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 shrink-0">#{currentUserRank}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {currentUserEntry.full_name}{' '}
              <span className="text-gray-400 font-normal">(You)</span>
            </p>
          </div>
          <span className="text-sm font-bold text-brand-600 whitespace-nowrap">
            {currentUserEntry.total_points.toLocaleString()} pts
          </span>
        </div>
      )}
    </div>
  );
}