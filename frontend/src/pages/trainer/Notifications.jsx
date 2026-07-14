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
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold text-[#253B80]">

          Notifications

        </h1>

        <p className="text-gray-500 mt-2">

          Stay updated on course requests,
          approvals,
          and development activities.

        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item) => (

          <NotificationStatCard
            key={item.title}
            {...item}
          />

        ))}

      </div>

      {/* Content */}

      <div className="grid grid-cols-4 gap-8">

        {/* Left */}

        <div className="col-span-3">

          <FilterBar />

          <div className="space-y-6">

            {activities.map((activity) => (

              <ActivityCard
                key={activity.id}
                activity={activity}
              />

            ))}

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          <RecentTimeline />

          <TrainerGuide />

        </div>

      </div>

    </div>
  );
}