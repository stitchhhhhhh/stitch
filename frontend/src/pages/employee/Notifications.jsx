import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/userService";

import NotificationFilter from "../../components/employee/notifications/NotificationFilter";
import NotificationCard from "../../components/employee/notifications/NotificationCard";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] =
  useState("all");

  useEffect(() => {
    let isMounted = true;

    getNotifications().then((data) => {
      if (!isMounted) return;
      setNotifications(data);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleMarkRead(notificationId) {
    await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading notifications...
      </div>
    );
  }

async function handleMarkAllRead() {
  try {
    await markAllNotificationsRead();

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );

    alert(
      "Semua notifikasi sudah ditandai sebagai dibaca."
    );
  } catch (err) {
    alert(
      err?.message ||
        "Gagal menandai semua notifikasi."
    );
  }
}

  const displayNotifications = notifications.map((n) => ({
    id: n.notification_id,
    unread: !n.is_read,
    icon: "🔔",
    title: n.title,
    description: n.message,
    time: timeAgo(n.created_date),
    actions: n.is_read
      ? []
      : [
          {
            label: "Tandai Dibaca",
            onClick: () => handleMarkRead(n.notification_id),
          },
        ],
  }));

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Notifications
        </h1>
        <p className="text-gray-500 mt-2">
          Stay updated with your latest courses, assessments, certificates, and learning activities.
        </p>
      </div>

      <NotificationFilter
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
  onMarkAllRead={handleMarkAllRead}
/>

      {displayNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-6">
          {displayNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}

    </div>
  );
}
