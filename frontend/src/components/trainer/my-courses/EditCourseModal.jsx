import { useEffect, useState } from "react";

export default function EditCourseModal({
  course,
  onClose,
  onSave,
  saving = false,
}) {
  const [courseTitle, setCourseTitle] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [deadline, setDeadline] =
    useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) {
      return;
    }

    setCourseTitle(course.title || "");
    setDescription(course.description || "");

    if (course.deadline) {
      const parsedDeadline = new Date(
        course.deadline
      );

      if (
        !Number.isNaN(
          parsedDeadline.getTime()
        )
      ) {
        setDeadline(
          parsedDeadline
            .toISOString()
            .slice(0, 10)
        );
      }
    } else {
      setDeadline("");
    }

    setError("");
  }, [course]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!courseTitle.trim()) {
      setError(
        "Course title is required."
      );
      return;
    }

    setError("");

    onSave({
      course_title: courseTitle.trim(),
      description: description.trim(),
      deadline: deadline || null,
    });
  }

  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-[#253B80]">
          Edit Course
        </h2>

        <p className="mt-2 text-gray-500">
          Update the course information before
          submitting it for review.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="edit-course-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Course Title
            </label>

            <input
              id="edit-course-title"
              type="text"
              value={courseTitle}
              onChange={(event) =>
                setCourseTitle(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
            />
          </div>

          <div>
            <label
              htmlFor="edit-course-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="edit-course-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={saving}
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
            />
          </div>

          <div>
            <label
              htmlFor="edit-course-deadline"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Deadline
            </label>

            <input
              id="edit-course-deadline"
              type="date"
              value={deadline}
              onChange={(event) =>
                setDeadline(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#3046D3] px-5 py-3 font-semibold text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}