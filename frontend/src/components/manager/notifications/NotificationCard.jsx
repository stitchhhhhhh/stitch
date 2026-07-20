export default function NotificationCard({
  item,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`w-full text-left rounded-3xl border p-6 transition hover:shadow-md ${
        item.unread
          ? "border-[#4453F2] bg-[#EEF2FF]"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-lg">
            {item.title}
          </h3>

          <p className="text-gray-500 mt-2">
            {item.message}
          </p>
        </div>

        {item.unread && (
          <span className="w-3 h-3 rounded-full bg-[#4453F2]" />
        )}
      </div>

      <div className="flex justify-between mt-5 text-sm">
        <span className="bg-[#EEF2FF] px-3 py-1 rounded-full">
          {item.type}
        </span>

        <span className="text-gray-400">
          {item.time}
        </span>
      </div>
    </button>
  );
}