import { Bell } from "lucide-react";
import { notificationPreferences } from "./settingsData";

export default function NotificationPreferences() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex items-center gap-2 mb-8">
        <Bell size={20} className="text-[#3046D3]" />
        <h2 className="text-xl font-semibold">
          Notification Preferences
        </h2>
      </div>

      <div className="divide-y">

        {notificationPreferences.map((item) => (

          <div
            key={item.title}
            className="flex items-center justify-between py-6"
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
              className={`
                w-14
                h-8
                rounded-full
                relative
                transition
                ${
                  item.enabled
                    ? "bg-[#3046D3]"
                    : "bg-gray-300"
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-1
                  w-6
                  h-6
                  rounded-full
                  bg-white
                  transition
                  ${
                    item.enabled
                      ? "right-1"
                      : "left-1"
                  }
                `}
              />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}