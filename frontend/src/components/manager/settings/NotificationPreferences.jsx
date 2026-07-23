import { Bell } from "lucide-react";

const preferenceItems = [
  {
    key: "notify_course",
    title: "Course Notifications",
    description:
      "Receive updates about courses, enrollments, and training activities.",
  },
  {
    key: "notify_deadline",
    title: "Deadline Reminders",
    description:
      "Receive reminders about upcoming course and assessment deadlines.",
  },
  {
    key: "notify_certificate",
    title: "Certificate Notifications",
    description:
      "Receive notifications when certificates are generated or available.",
  },
];

export default function NotificationPreferences({
  preferences,
  onChange,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div className="flex items-center gap-2 mb-8">
        <Bell
          size={20}
          className="text-[#3046D3]"
        />

        <h2 className="text-xl font-semibold">
          Notification Preferences
        </h2>
      </div>

      <div className="divide-y">
        {preferenceItems.map((item) => {
          const enabled =
            Boolean(preferences?.[item.key]);

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-6 py-6"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={item.title}
                onClick={() =>
                  onChange(
                    item.key,
                    !enabled
                  )
                }
                className={`w-14 h-8 rounded-full relative shrink-0 transition ${
                  enabled
                    ? "bg-[#3046D3]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                    enabled
                      ? "left-7"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}