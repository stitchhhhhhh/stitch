export default function NotificationCard({
  title,
  description,
  time,
  category,
  badge,
  type,
}) {
  const badgeColor = {
    new: "bg-[#EEF2FF] text-[#2F3FE4]",
    pending: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">

      <div className="flex justify-between">

        <div className="flex gap-4">

          <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
            📄
          </div>

          <div>

            <h3 className="font-semibold text-lg">
              {title}
            </h3>

            <p className="text-gray-500 mt-2 leading-relaxed">
              {description}
            </p>

            <div className="flex gap-6 mt-5 text-gray-400 text-sm">
              <span>{time}</span>
              <span>{category}</span>
            </div>

          </div>

        </div>

        <span
          className={`px-4 h-8 rounded-full text-sm flex items-center ${
            badgeColor[type]
          }`}
        >
          {badge}
        </span>

      </div>

    </div>
  );
}