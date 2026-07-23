import ToggleSwitch from "./ToggleSwitch";

const notificationItems = [
  {
    key: "notify_course",
    title: "Course Updates",
    subtitle: "Receive notifications about course updates and assignments.",
  },
  {
    key: "notify_deadline",
    title: "Deadline Reminders",
    subtitle: "Receive reminders before course deadlines.",
  },
  {
    key: "notify_certificate",
    title: "Certificate Updates",
    subtitle: "Receive notifications when certificates are available.",
  },
];

export default function NotificationPreferences({
  preferences,
  onChange,
  disabled = false,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#253B80] mb-10">
        Notification Preferences
      </h2>

      <div className="space-y-8">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-center gap-6"
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
              enabled={Boolean(preferences?.[item.key])}
              disabled={disabled}
              onChange={(enabled) =>
                onChange?.(item.key, enabled)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
