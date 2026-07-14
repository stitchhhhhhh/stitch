export default function DeadlinePanel() {
  const items = [
    {
      title: "Data Privacy 2024",
      due: "Due in 2 days",
      learners: 12,
      width: "75%",
      color: "bg-red-500",
    },
    {
      title: "Managerial Excellence",
      due: "Due in 5 days",
      learners: 4,
      width: "55%",
      color: "bg-[#2F3FE4]",
    },
    {
      title: "Soft Skills Workshop",
      due: "Due in 12 days",
      learners: 45,
      width: "28%",
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Upcoming Deadlines
      </h2>

      <div className="space-y-6">

        {items.map((item) => (

          <div key={item.title}>

            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {item.due} • {item.learners} learners left
            </p>

            <div className="mt-3 h-2 rounded-full bg-gray-200">
              <div
                className={`${item.color} h-2 rounded-full`}
                style={{ width: item.width }}
              />
            </div>

          </div>

        ))}

      </div>

      <button className="mt-8 w-full border border-[#2F3FE4] rounded-xl py-3 text-[#2F3FE4] font-medium">
        Manage All Deadlines
      </button>

    </div>
  );
}