export default function NotificationFilters() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 flex gap-4">

      <select className="border rounded-xl px-4 py-2">

        <option>All Notifications</option>

      </select>

      <select className="border rounded-xl px-4 py-2">

        <option>All Types</option>

      </select>

      <input
        placeholder="Search..."
        className="border rounded-xl px-4 py-2 flex-1"
      />

    </div>
  );
}