export default function QuickActions() {
  const actions = [
    {
      title: "Continue Editing",
      icon: "✏️",
    },
    {
      title: "Upload Materials",
      icon: "📁",
    },
    {
      title: "View Course",
      icon: "👁️",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-xl font-bold text-[#253B80] mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {actions.map((item) => (

          <button
            key={item.title}
            className="w-full flex items-center gap-4 bg-[#F7F8FF] hover:bg-[#EEF2FF] transition rounded-2xl p-4"
          >

            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">

              {item.icon}

            </div>

            <span className="font-medium">

              {item.title}

            </span>

          </button>

        ))}

      </div>

    </div>
  );
}