export default function RequestDetail() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">

      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-[#253B80]">
          Course Preview
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Review submitted course before approval.
        </p>
      </div>

      {/* Course Information */}
      <div className="mt-6 space-y-4">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Advanced Strategic Leadership
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Submitted by Sarah Miller
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-400">Category</p>
            <p className="font-medium mt-1">Management</p>
          </div>

          <div>
            <p className="text-gray-400">Duration</p>
            <p className="font-medium mt-1">8 Weeks</p>
          </div>

          <div>
            <p className="text-gray-400">Level</p>
            <p className="font-medium mt-1">Intermediate</p>
          </div>

          <div>
            <p className="text-gray-400">Language</p>
            <p className="font-medium mt-1">English</p>
          </div>

        </div>

      </div>

      {/* Description */}
      <div className="mt-8">
        <h4 className="font-semibold text-gray-900">
          Description
        </h4>

        <p className="text-sm text-gray-500 mt-2 leading-6">
          This course equips managers with strategic leadership
          capabilities including decision-making, team alignment,
          organizational communication, and change management.
        </p>
      </div>

      {/* Learning Outcomes */}
      <div className="mt-8">

        <h4 className="font-semibold text-gray-900">
          Learning Outcomes
        </h4>

        <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
          <li>Develop strategic leadership mindset.</li>
          <li>Improve organizational communication.</li>
          <li>Lead high-performing teams.</li>
          <li>Handle organizational change effectively.</li>
        </ul>

      </div>

      {/* Assessment */}
      <div className="mt-8">

        <h4 className="font-semibold text-gray-900">
          Assessment Summary
        </h4>

        <div className="bg-gray-50 rounded-xl mt-3 p-4 space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Quiz
            </span>

            <span className="font-semibold">
              20 Questions
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Passing Score
            </span>

            <span className="font-semibold">
              80%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Attempts
            </span>

            <span className="font-semibold">
              3
            </span>
          </div>

        </div>

      </div>

      {/* Attachments */}
      <div className="mt-8">

        <h4 className="font-semibold text-gray-900">
          Attachments
        </h4>

        <div className="space-y-3 mt-3">

          <div className="border rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm">
              📄 Course_Outline.pdf
            </span>

            <button className="text-blue-600 text-sm">
              View
            </button>
          </div>

          <div className="border rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm">
              🎥 Introduction.mp4
            </span>

            <button className="text-blue-600 text-sm">
              View
            </button>
          </div>

        </div>

      </div>

      {/* Notes */}
      <div className="mt-8">

        <h4 className="font-semibold text-gray-900">
          Approval Notes
        </h4>

        <textarea
          rows="4"
          placeholder="Write your review..."
          className="w-full mt-3 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#2F3FE4]"
        />

      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-3">

        <button className="bg-[#2F3FE4] hover:bg-[#2234d6] text-white py-3 rounded-xl font-semibold transition">
          Confirm Approval
        </button>

        <button className="border border-orange-400 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 transition">
          Request Revision
        </button>

        <button className="border border-red-400 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
          Reject Course
        </button>

      </div>

    </div>
  );
}