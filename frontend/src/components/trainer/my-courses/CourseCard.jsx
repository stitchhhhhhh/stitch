import ProgressBar from "./ProgressBar";

export default function CourseCard({
  course,
  onSubmit,
  onEdit,
  onView,
  submitting = false,
}) {
  const canSubmit =
    course.statusGroup === "draft" ||
    course.statusGroup === "development";

  function handleDetails() {
    if (typeof onView === "function") {
      onView(course);
    }
  }

  function handlePrimaryAction() {
    const action =
      course.primaryButton?.toLowerCase() || "";

    if (
      action.includes("edit") ||
      action.includes("revise")
    ) {
      if (typeof onEdit === "function") {
        onEdit(course);
      }

      return;
    }

    if (typeof onView === "function") {
      onView(course);
    }
  }

  function handleSubmit() {
    if (
      typeof onSubmit === "function" &&
      !submitting
    ) {
      onSubmit(course);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative">
        <img
          src={course.image || "/icon.jpeg"}
          alt={course.title}
          className="h-48 w-full object-cover"
        />

        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${course.badgeColor}`}
        >
          {course.status}
        </span>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-[#253B80]">
          {course.title}
        </h2>

        <p className="mt-1 text-gray-500">
          {course.trainingType}
        </p>

        <p className="text-gray-500">
          {course.department}
        </p>

        <div className="mt-6">
          <ProgressBar progress={course.progress} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {course.updated}
          </span>

          <button
            type="button"
            onClick={handleDetails}
            className="text-sm font-semibold text-[#3046D3] hover:underline"
          >
            {course.secondaryButton || "Details"}
          </button>
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
            course.status === "Revision Required"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[#3046D3] text-white hover:bg-[#253B80]"
          }`}
        >
          {course.primaryButton || "View Course"}
        </button>

        {canSubmit && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-3 w-full rounded-xl border border-[#3046D3] py-3 font-semibold text-[#3046D3] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Course"}
          </button>
        )}
      </div>
    </div>
  );
}
