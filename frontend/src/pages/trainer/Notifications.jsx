import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/trainerService";

import NotificationStatCard from "../../components/trainer/notifications/NotificationStatCard";
import FilterBar from "../../components/trainer/notifications/FilterBar";
import ActivityCard from "../../components/trainer/notifications/ActivityCard";
import RecentTimeline from "../../components/trainer/notifications/RecentTimeline";
import TrainerGuide from "../../components/trainer/notifications/TrainerGuide";

function formatRelativeTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getNotificationStyle(notification) {
  const text = `${notification.title || ""} ${
    notification.message || ""
  }`.toLowerCase();

  if (text.includes("revision")) {
    return {
      badge: "Revision",
      badgeColor: "bg-red-100 text-red-600",
    };
  }

  if (
    text.includes("approved") ||
    text.includes("disetujui") ||
    text.includes("approval")
  ) {
    return {
      badge: "Approved",
      badgeColor: "bg-green-100 text-green-600",
    };
  }

  if (
    text.includes("published") ||
    text.includes("active") ||
    text.includes("dipublikasikan")
  ) {
    return {
      badge: "Published",
      badgeColor: "bg-indigo-100 text-indigo-700",
    };
  }

  if (
    text.includes("request") ||
    text.includes("permintaan")
  ) {
    return {
      badge: "New Request",
      badgeColor: "bg-blue-100 text-blue-700",
    };
  }

  return {
    badge: notification.is_read ? "Read" : "New",
    badgeColor: notification.is_read
      ? "bg-gray-100 text-gray-600"
      : "bg-blue-100 text-blue-700",
  };
}

function normalizeNotification(notification) {
  const style = getNotificationStyle(notification);

  return {
    id: notification.id,
    title: notification.title || "Notification",
    subtitle:
      notification.message || "No notification details.",
    time: formatRelativeTime(notification.created_date),
    createdDate: notification.created_date,
    isRead: Boolean(notification.is_read),
    badge: style.badge,
    badgeColor: style.badgeColor,
    primary: "View Details",
    secondary: notification.is_read ? "" : "Mark as Read",
  };
}

function isToday(value) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function TrainerNotifications() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setError("");

      const data = await getNotifications();

      setActivities(
        data.map(normalizeNotification)
      );
    } catch (err) {
      setError(
        err.message || "Failed to retrieve notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredActivities = useMemo(() => {
    if (filter === "unread") {
      return activities.filter(
        (activity) => !activity.isRead
      );
    }

    if (filter === "read") {
      return activities.filter(
        (activity) => activity.isRead
      );
    }

    return activities;
  }, [activities, filter]);

  const stats = useMemo(() => {
    const unread = activities.filter(
      (activity) => !activity.isRead
    ).length;

    const read = activities.filter(
      (activity) => activity.isRead
    ).length;

    const today = activities.filter((activity) =>
      isToday(activity.createdDate)
    ).length;

    return [
      {
        title: "Unread",
        value: unread,
        color: "text-[#3046D3]",
        icon: "🔔",
      },
      {
        title: "Read",
        value: read,
        color: "text-green-600",
        icon: "✓",
      },
      {
        title: "Today",
        value: today,
        color: "text-orange-500",
        icon: "📅",
      },
      {
        title: "Total",
        value: activities.length,
        color: "text-gray-800",
        icon: "📋",
      },
    ];
  }, [activities]);

  const timeline = useMemo(
    () =>
      activities.slice(0, 4).map((activity) => ({
        id: activity.id,
        title: activity.title,
        desc: activity.subtitle,
        time: activity.time,
      })),
    [activities]
  );

  function handlePrimary(activity) {
    const text = `${activity.title} ${activity.subtitle}`.toLowerCase();

    if (
      text.includes("request") ||
      text.includes("permintaan")
    ) {
      navigate("/trainer/requests");
      return;
    }

    if (
      text.includes("course") ||
      text.includes("kursus") ||
      text.includes("revision") ||
      text.includes("approved") ||
      text.includes("published")
    ) {
      navigate("/trainer/courses");
      return;
    }

    navigate("/trainer");
  }

  async function handleSecondary(activity) {
    if (activity.isRead) return;

    try {
      setUpdatingId(activity.id);
      setError("");

      await markNotificationAsRead(activity.id);

      setActivities((current) =>
        current.map((item) =>
          item.id === activity.id
            ? {
                ...item,
                isRead: true,
                badge: "Read",
                badgeColor:
                  "bg-gray-100 text-gray-600",
                secondary: "",
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to update notification."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setMarkingAll(true);
      setError("");

      await markAllNotificationsAsRead();

      setActivities((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
          badge: "Read",
          badgeColor: "bg-gray-100 text-gray-600",
          secondary: "",
        }))
      );
    } catch (err) {
      setError(
        err.message || "Failed to update notifications."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Notifications
        </h1>

        <p className="mt-2 text-gray-500">
          Stay updated on course requests, approvals,
          and development activities.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <NotificationStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            onMarkAllRead={handleMarkAllAsRead}
            markingAll={markingAll}
            hasUnread={activities.some(
              (activity) => !activity.isRead
            )}
          />

          <div className="space-y-6">
            {filteredActivities.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
                No notifications found.
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPrimary={handlePrimary}
                  onSecondary={handleSecondary}
                  updating={updatingId === activity.id}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <RecentTimeline timeline={timeline} />
          <TrainerGuide />
        </div>
      </div>
    </div>
  );
}
