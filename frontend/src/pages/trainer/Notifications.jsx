import { useNavigate } from "react-router-dom";

import {
  stats,
  activities,
} from "../../components/trainer/notifications/notificationsData";

import NotificationStatCard from "../../components/trainer/notifications/NotificationStatCard";
import FilterBar from "../../components/trainer/notifications/FilterBar";
import ActivityCard from "../../components/trainer/notifications/ActivityCard";
import RecentTimeline from "../../components/trainer/notifications/RecentTimeline";
import TrainerGuide from "../../components/trainer/notifications/TrainerGuide";

export default function TrainerNotifications() {
  const navigate = useNavigate();

  function handlePrimary(activity) {
    const action =
      activity.primary?.toLowerCase() || "";

    if (action.includes("dashboard")) {
      navigate("/trainer");
      return;
    }

    if (
      action.includes("course") ||
      action.includes("editing") ||
      action.includes("feedback")
    ) {
      navigate("/trainer/courses");
      return;
    }

    alert(`${activity.primary} berhasil dijalankan.`);
  }

  function handleSecondary(activity) {
    const action =
      activity.secondary?.toLowerCase() || "";

    if (action.includes("dismiss")) {
      alert("Notification dismissed.");
      return;
    }

    if (action.includes("read")) {
      alert("Notification marked as read.");
      return;
    }

    navigate("/trainer/requests");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Notifications
        </h1>

        <p className="text-gray-500 mt-2">
          Stay updated on course requests, approvals,
          and development activities.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <NotificationStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3">
          <FilterBar />

          <div className="space-y-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPrimary={handlePrimary}
                onSecondary={handleSecondary}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <RecentTimeline />
          <TrainerGuide />
        </div>
      </div>
    </div>
  );
}