import { useEffect, useMemo, useState } from "react";

import {
  getManagerNotifications,
  markManagerNotificationRead,
  markAllManagerNotificationsRead,
} from "../../services/managerService";

import NotificationSummary from "../../components/manager/notifications/NotificationSummary";
import NotificationCard from "../../components/manager/notifications/NotificationCard";
import NotificationFilters from "../../components/manager/notifications/NotificationFilters";
import RecentAnnouncements from "../../components/manager/notifications/RecentAnnouncements";
import QuickActions from "../../components/manager/notifications/QuickActions";

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

function getNotificationType(notification) {
  const text = `${notification.title || ""} ${
    notification.message || ""
  }`.toLowerCase();

  if (
    text.includes("proposal") ||
    text.includes("pengajuan")
  ) {
    return "Proposal";
  }

  if (
    text.includes("training") ||
    text.includes("course") ||
    text.includes("deadline") ||
    text.includes("pelatihan")
  ) {
    return "Training";
  }

  if (
    text.includes("announcement") ||
    text.includes("announcement") ||
    text.includes("pengumuman")
  ) {
    return "Announcement";
  }

  if (
    text.includes("analytics") ||
    text.includes("report") ||
    text.includes("laporan")
  ) {
    return "Analytics";
  }

  return "System";
}

function normalizeNotification(notification) {
  return {
    id: notification.id,
    title: notification.title || "Notification",
    message:
      notification.message ||
      "No notification details available.",
    type: getNotificationType(notification),
    time: formatRelativeTime(
      notification.created_date ||
        notification.created_at
    ),
    unread: !Boolean(notification.is_read),
  };
}

export default function Notifications() {
  const [notificationList, setNotificationList] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] =
    useState(false);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getManagerNotifications();

      const notifications = Array.isArray(result)
        ? result
        : result.data ?? [];

      setNotificationList(
        notifications.map(normalizeNotification)
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to retrieve notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () =>
      notificationList.filter(
        (item) => item.unread
      ).length,
    [notificationList]
  );

  const summary = useMemo(() => {
    const trainingAlerts =
      notificationList.filter(
        (item) => item.type === "Training"
      ).length;

    const announcements =
      notificationList.filter(
        (item) =>
          item.type === "Announcement" ||
          item.type === "System"
      ).length;

    const completed =
      notificationList.filter(
        (item) => !item.unread
      ).length;

    return [
      {
        title: "Unread",
        value: unreadCount,
      },
      {
        title: "Training Alerts",
        value: trainingAlerts,
      },
      {
        title: "Announcements",
        value: announcements,
      },
      {
        title: "Completed",
        value: completed,
      },
    ];
  }, [notificationList, unreadCount]);

  const recentAnnouncements = useMemo(
    () =>
      notificationList
        .filter(
          (item) =>
            item.type === "Announcement" ||
            item.type === "System"
        )
        .slice(0, 3),
    [notificationList]
  );

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;

    try {
      setMarkingAll(true);
      setError("");

      await markAllManagerNotificationsRead();

      setNotificationList((current) =>
        current.map((item) => ({
          ...item,
          unread: false,
        }))
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleNotificationClick(
    selected
  ) {
    if (!selected.unread) return;

    try {
      setUpdatingId(selected.id);
      setError("");

      await markManagerNotificationRead(
        selected.id
      );

      setNotificationList((current) =>
        current.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                unread: false,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to update notification."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleSendReminder() {
    const message = window.prompt(
      "Masukkan isi reminder:"
    );

    if (!message) return;

    alert(
      `Reminder berhasil disiapkan:\n${message}`
    );
  }

  function handleExport() {
    const rows = [
      [
        "Title",
        "Message",
        "Type",
        "Time",
        "Unread",
      ],
      ...notificationList.map((item) => [
        item.title,
        item.message,
        item.type,
        item.time,
        item.unread ? "Yes" : "No",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "manager-notifications.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Notifications
          </h1>

          <p className="mt-2 text-gray-500">
            Stay updated with department
            activities and reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={
            unreadCount === 0 || markingAll
          }
          className="rounded-xl bg-[#4453F2] px-6 py-3 text-white transition hover:bg-[#3442d9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markingAll
            ? "Updating..."
            : "Mark All Read"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <NotificationSummary
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <NotificationFilters />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          {notificationList.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              No notifications found.
            </div>
          ) : (
            notificationList.map((item) => (
              <div
                key={item.id}
                className={
                  updatingId === item.id
                    ? "pointer-events-none opacity-60"
                    : ""
                }
              >
                <NotificationCard
                  item={item}
                  onClick={
                    handleNotificationClick
                  }
                />
              </div>
            ))
          )}
        </div>

        <div className="space-y-6 xl:col-span-4">
          <QuickActions
            onMarkAllRead={
              handleMarkAllRead
            }
            onSendReminder={
              handleSendReminder
            }
            onExport={handleExport}
          />

          <RecentAnnouncements
            announcements={
              recentAnnouncements
            }
          />
        </div>
      </div>
    </div>
  );
}