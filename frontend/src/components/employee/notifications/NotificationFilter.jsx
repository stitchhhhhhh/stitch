import { filters } from "./notificationsData";

export default function NotificationFilter() {
  return (
    <div className="flex justify-between items-center">

      <div className="flex gap-3 flex-wrap">

        {filters.map((filter, index) => (

          <button
            key={filter}
            className={`px-6 py-3 rounded-full border transition

            ${
              index === 0
                ? "bg-[#3046D3] text-white border-[#3046D3]"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>

        ))}

      </div>

      <button className="text-[#3046D3] font-semibold">

        ✓ Mark all as read

      </button>

    </div>
  );
}