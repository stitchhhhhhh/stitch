export default function QuickActions() {
  return (
    <div className="bg-[#4453F2] rounded-3xl p-6 text-white">

      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">

        <button className="w-full bg-white text-[#4453F2] rounded-xl py-3 font-semibold hover:bg-gray-100 transition">

          Mark All as Read

        </button>

        <button className="w-full bg-[#6170FF] rounded-xl py-3 hover:bg-[#5563f2] transition">

          Send Reminder

        </button>

        <button className="w-full bg-[#6170FF] rounded-xl py-3 hover:bg-[#5563f2] transition">

          Export Notifications

        </button>

      </div>

    </div>
  );
}