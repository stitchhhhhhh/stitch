import ProgressBar from "./ProgressBar";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition">

      {/* Thumbnail */}

      <div className="relative">

        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />

        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${course.badgeColor}`}
        >
          {course.status}
        </span>

      </div>

      {/* Body */}

      <div className="p-6">

        <h2 className="text-xl font-bold text-[#253B80]">

          {course.title}

        </h2>

        <p className="text-gray-500 mt-1">

          {course.trainingType}

        </p>

        <p className="text-gray-500">

          {course.department}

        </p>

        <div className="mt-6">

          <ProgressBar
            progress={course.progress}
          />

        </div>

        <div className="flex justify-between items-center mt-6">

          <span className="text-sm text-gray-500">

            {course.updated}

          </span>

          <button className="text-[#3046D3] text-sm font-semibold hover:underline">

            {course.secondaryButton || "Details"}

          </button>

        </div>

        <button
          className={`
            mt-6
            w-full
            py-3
            rounded-xl
            font-semibold
            transition

            ${
              course.status === "Revision Required"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#3046D3] text-white hover:bg-[#253B80]"
            }
          `}
        >

          {course.primaryButton}

        </button>

      </div>

    </div>
  );
}