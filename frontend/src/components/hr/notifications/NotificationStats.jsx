export default function NotificationStats() {
  const stats = [
    {
      title: "UNREAD",
      value: "12",
      icon: "💬",
    },
    {
      title: "PENDING ACTIONS",
      value: "08",
      icon: "📋",
    },
    {
      title: "NEW REQUESTS",
      value: "04",
      icon: "📄",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-3xl shadow-sm p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-2xl">
              {item.icon}
            </div>

            <div>
              <p className="text-xs tracking-widest text-gray-500">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold text-[#253B80] mt-1">
                {item.value}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}