export default function RecentAnnouncements({
  announcements = [],
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#253B80]">
          Recent Announcements
        </h2>

        <button className="text-[#4453F2] text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No announcements available.
          </p>
        ) : (
          announcements.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start"
            >
              <div className="w-2 h-2 rounded-full bg-[#4453F2] mt-2" />

              <p className="text-gray-600">
                {typeof item === "string"
                  ? item
                  : item.title ??
                    item.message ??
                    ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}