import {
  notifications,
} from "./settingsData";

import ToggleSwitch from "./ToggleSwitch";

export default function NotificationPreferences() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-bold text-[#253B80] mb-10">
        Notification Preferences
      </h2>

      <div className="space-y-8">

        {notifications.map((item) => (

          <div
            key={item.id}
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
              enabled={item.enabled}
            />

          </div>

        ))}

      </div>

    </div>
  );
}