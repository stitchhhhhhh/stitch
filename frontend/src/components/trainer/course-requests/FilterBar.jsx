export default function FilterBar() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-6">

      <div className="flex items-center gap-2">

        <span className="text-gray-500">
          Type
        </span>

        <select className="outline-none font-medium bg-transparent">

          <option>
            All Types
          </option>

          <option>
            General Training
          </option>

          <option>
            Department Training
          </option>

        </select>

      </div>

      <div className="w-px h-8 bg-gray-200" />

      <div className="flex items-center gap-2">

        <span className="text-gray-500">
          Status
        </span>

        <select className="outline-none font-medium bg-transparent">

          <option>
            All Status
          </option>

          <option>
            New Request
          </option>

          <option>
            Accepted
          </option>

          <option>
            In Development
          </option>

          <option>
            Completed
          </option>

        </select>

      </div>

      <button className="ml-auto border rounded-xl px-5 py-2 hover:bg-gray-100 transition">
        Advanced Filters
      </button>

    </div>
  );
}