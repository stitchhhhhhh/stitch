import { useNavigate } from "react-router-dom";

export default function QuickActions({ onUpload }) {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Continue Editing",
      icon: "✏️",
      action: () => navigate("/trainer/courses?action=edit"),
    },
    {
      title: "Upload Materials",
      icon: "📁",
      action: onUpload,
    },
    {
      title: "View Course",
      icon: "👁️",
      action: () => navigate("/trainer/courses?action=view"),
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
            type="button"
            key={item.title}
            onClick={item.action}
            className="w-full flex items-center gap-4 bg-[#F7F8FF] hover:bg-[#EEF2FF] transition rounded-2xl p-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              {item.icon}
            </div>

            <span className="font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}