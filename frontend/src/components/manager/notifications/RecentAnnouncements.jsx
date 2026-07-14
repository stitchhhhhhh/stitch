import { announcements } from "./notificationsData";

export default function RecentAnnouncements() {
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

        {announcements.map((item, index) => (

          <div
            key={index}
            className="flex gap-3 items-start"
          >

            <div className="w-2 h-2 rounded-full bg-[#4453F2] mt-2" />

            <p className="text-gray-600">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}