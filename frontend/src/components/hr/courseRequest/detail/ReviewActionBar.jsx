import { Link } from "react-router-dom";

export default function ReviewActionBar() {
  return (
    <div className="sticky bottom-0 bg-white border rounded-2xl shadow-lg p-5 mt-8">

      <div className="flex justify-between items-center">

        <span className="text-gray-500">
          Reviewing as HR Admin
        </span>

        <div className="flex gap-4">

          <Link
            to="/hr/course-requests"
            className="px-6 py-3 rounded-xl border border-red-400 text-red-600 hover:bg-red-50"
          >
            Reject
          </Link>

          <button className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200">
            Request Revision
          </button>

          <button className="px-8 py-3 rounded-xl bg-[#2F3FE4] text-white hover:bg-[#2432c7]">
            Approve Course
          </button>

        </div>

      </div>

    </div>
  );
}