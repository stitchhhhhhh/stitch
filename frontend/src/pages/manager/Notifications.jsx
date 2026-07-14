import NotificationSummary from "../../components/manager/notifications/NotificationSummary";
import NotificationCard from "../../components/manager/notifications/NotificationCard";
import NotificationFilters from "../../components/manager/notifications/NotificationFilters";
import RecentAnnouncements from "../../components/manager/notifications/RecentAnnouncements";
import QuickActions from "../../components/manager/notifications/QuickActions";

import {
  summary,
  notifications,
} from "../../components/manager/notifications/notificationsData";

export default function Notifications() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with department activities and reminders.
          </p>

        </div>

        <button className="bg-[#4453F2] text-white rounded-xl px-6 py-3 hover:bg-[#3442d9] transition">

          Mark All Read

        </button>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-4 gap-6">

        {summary.map((item, index) => (

          <NotificationSummary
            key={index}
            {...item}
          />

        ))}

      </div>

      {/* Filters */}

      <NotificationFilters />

      {/* Content */}

      <div className="grid grid-cols-12 gap-6">

        {/* Notification List */}

        <div className="col-span-8 space-y-5">

          {notifications.map((item, index) => (

            <NotificationCard
              key={index}
              item={item}
            />

          ))}

        </div>

        {/* Sidebar */}

        <div className="col-span-4 space-y-6">

          <QuickActions />

          <RecentAnnouncements />

        </div>

      </div>

    </div>
  );
}