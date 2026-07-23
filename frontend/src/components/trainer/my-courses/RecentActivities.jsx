export default function RecentActivities({ activities = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No course activity yet.
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-[#3046D3] mt-2 shrink-0" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
