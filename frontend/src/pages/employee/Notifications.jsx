import {
  notifications,
} from "../../components/employee/notifications/notificationsData";

import NotificationFilter from "../../components/employee/notifications/NotificationFilter";
import NotificationCard from "../../components/employee/notifications/NotificationCard";

export default function Notifications() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold text-[#253B80]">
          Notifications
        </h1>

        <p className="text-gray-500 mt-2">
          Stay updated with your latest courses, assessments, certificates, and learning activities.
        </p>

      </div>

      {/* Filter */}

      <NotificationFilter />

      {/* Notification List */}

      <div className="space-y-6">

        {notifications.map((notification) => (

          <NotificationCard
            key={notification.id}
            notification={notification}
          />

        ))}

      </div>

    </div>
  );
}