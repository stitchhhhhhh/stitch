import ToggleSwitch from "./ToggleSwitch";

const ITEMS = [
  {
    key: "notify_course",
    title: "Course notifications",
    subtitle: "New content available in your enrolled tracks.",
  },
  {
    key: "notify_deadline",
    title: "Deadline reminders",
    subtitle: "Alerts for mandatory training completions.",
  },
  {
    key: "notify_certificate",
    title: "Certificate notifications",
    subtitle: "Receive alerts when new certificates are issued.",
  },
];

export default function NotificationPreferences({ preferences, onToggle }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#253B80] mb-10">
        Notification Preferences
      </h2>

      <div className="space-y-8">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>
              <p className="text-gray-500 mt-2">
                {item.subtitle}
              </p>
            </div>
            <ToggleSwitch
              enabled={preferences?.[item.key] ?? false}
              onClick={() => onToggle(item.key, !preferences?.[item.key])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
