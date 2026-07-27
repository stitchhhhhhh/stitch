import { useEffect, useState } from "react";
import NotificationCard from "../../components/hr/notifications/NotificationCard";
import { getHROverview, getHRNotifications, markAllHRNotificationsRead, markHRNotificationRead } from "../../services/hrService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { try { setLoading(true); const [items, summary] = await Promise.all([getHRNotifications(), getHROverview()]); setNotifications(Array.isArray(items) ? items : []); setOverview(summary); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function markAll() { try { await markAllHRNotificationsRead(); await load(); } catch (e) { alert(e.message); } }
  async function markOne(id) { try { await markHRNotificationRead(id); setNotifications((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item)); } catch (e) { alert(e.message); } }
  if (loading) return <div className="bg-white rounded-3xl p-8">Loading notifications...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-3xl p-8">{error}</div>;
  const unread = notifications.filter((item) => !item.is_read).length;
  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[["Unread", unread],["Pending Approvals", overview?.pendingApprovals?.length || 0],["Upcoming Deadlines", overview?.upcomingDeadlines?.length || 0]].map(([label,value]) => <div key={label} className="bg-white rounded-3xl p-6 shadow-sm"><p className="text-gray-500 uppercase text-xs">{label}</p><h2 className="text-3xl font-bold mt-2">{value}</h2></div>)}</div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6"><div className="xl:col-span-8 space-y-5"><div className="flex justify-between items-center"><h2 className="text-2xl font-semibold">Recent Activity</h2><button onClick={markAll} className="text-[#2F3FE4] font-semibold">Mark all as read</button></div>{notifications.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center text-gray-400">No notifications.</div> : notifications.map((item) => <button key={item.id} type="button" onClick={() => markOne(item.id)} className="block w-full text-left"><NotificationCard type={item.is_read ? "success" : "new"} title={item.title} description={item.message} time={new Date(item.created_date).toLocaleString()} category="System" badge={item.is_read ? "Read" : "New"}/></button>)}</div>
      <div className="xl:col-span-4 space-y-5"><div className="bg-white rounded-3xl p-6 shadow-sm"><h2 className="text-xl font-semibold">Upcoming Deadlines</h2>{(overview?.upcomingDeadlines || []).length === 0 ? <p className="text-gray-400 mt-6">No upcoming deadlines.</p> : overview.upcomingDeadlines.map((item) => <div key={item.id} className="border-b py-4 last:border-0"><p className="font-semibold">{item.title}</p><p className="text-sm text-gray-500">{new Date(item.deadline).toLocaleDateString()} · {item.learnersRemaining} learners remaining</p></div>)}</div><div className="bg-white rounded-3xl p-6 shadow-sm"><h2 className="text-xl font-semibold">Pending Approvals</h2>{(overview?.pendingApprovals || []).length === 0 ? <p className="text-gray-400 mt-6">No pending approvals.</p> : overview.pendingApprovals.map((item) => <div key={item.id} className="border-b py-4 last:border-0"><p className="font-semibold">{item.title}</p><p className="text-sm text-gray-500">{item.type} · {item.owner}</p></div>)}</div></div>
    </div></div>;
}
