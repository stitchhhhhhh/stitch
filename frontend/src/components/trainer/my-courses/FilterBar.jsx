export default function FilterBar() {
  return (
    <div className="flex justify-between items-center">

      <div className="flex gap-4">

        <select className="px-5 py-3 rounded-xl border bg-white">

          <option>Training Type (All)</option>
          <option>General Training</option>
          <option>Department Training</option>

        </select>

        <select className="px-5 py-3 rounded-xl border bg-white">

          <option>Status (All)</option>
          <option>Draft</option>
          <option>In Development</option>
          <option>Pending Review</option>
          <option>Published</option>

        </select>

      </div>

      <button className="text-[#3046D3] font-semibold hover:underline">

        Clear Filters

      </button>

    </div>
  );
}