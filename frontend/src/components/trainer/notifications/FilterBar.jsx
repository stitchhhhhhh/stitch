export default function FilterBar() {
  return (
    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold text-[#253B80]">
        Activity Feed
      </h2>

      <div className="flex gap-8 items-center">

        <button className="text-[#3046D3] font-semibold hover:underline">
          Mark all as read
        </button>

        <select className="border rounded-xl px-4 py-2 bg-white">
          <option>Filter</option>
          <option>All</option>
          <option>Unread</option>
          <option>Approved</option>
          <option>Revision Needed</option>
          <option>Published</option>
        </select>

      </div>

    </div>
  );
}