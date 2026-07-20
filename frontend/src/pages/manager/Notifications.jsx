import { useMemo, useState } from "react";

import NotificationSummary from "../../components/manager/notifications/NotificationSummary";
import NotificationCard from "../../components/manager/notifications/NotificationCard";
import NotificationFilters from "../../components/manager/notifications/NotificationFilters";
import RecentAnnouncements from "../../components/manager/notifications/RecentAnnouncements";
import QuickActions from "../../components/manager/notifications/QuickActions";

import {
  summary,
  notifications as initialNotifications,
} from "../../components/manager/notifications/notificationsData";

export default function Notifications() {
  const [notificationList, setNotificationList] =
    useState(initialNotifications);

  const unreadCount = useMemo(
    () =>
      notificationList.filter(
        (item) => item.unread
      ).length,
    [notificationList]
  );

  function handleMarkAllRead() {
    setNotificationList((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );

    alert(
      "Semua notification sudah ditandai sebagai read."
    );
  }

  function handleNotificationClick(selected) {
    setNotificationList((current) =>
      current.map((item) =>
        item === selected
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );
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
          .map((value) =>
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

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "manager-notifications.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with department activities and reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="bg-[#4453F2] text-white rounded-xl px-6 py-3 hover:bg-[#3442d9] transition disabled:opacity-50"
        >
          Mark All Read
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {summary.map((item, index) => (
          <NotificationSummary
            key={index}
            {...item}
          />
        ))}
      </div>

      <NotificationFilters />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          {notificationList.map(
            (item, index) => (
              <NotificationCard
                key={item.id ?? index}
                item={item}
                onClick={
                  handleNotificationClick
                }
              />
            )
          )}
        </div>

        <div className="col-span-4 space-y-6">
          <QuickActions
            onMarkAllRead={
              handleMarkAllRead
            }
            onSendReminder={
              handleSendReminder
            }
            onExport={handleExport}
          />

          <RecentAnnouncements />
        </div>
      </div>
    </div>
  );
}