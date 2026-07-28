import {
  BookOpen,
  ChevronRight
} from 'lucide-react'

export default function CurrentCourseCard({
  course,
  onContinue
}) {
  if (!course) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <BookOpen
          size={36}
          className="mx-auto text-gray-300"
        />

        <h2 className="mt-4 text-lg font-bold text-gray-800">
          No active course
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Your current learning course will appear here.
        </p>
      </div>
    )
  }

  const progressValue = Number(
    course.enrollment?.completion_percentage ??
      course.completion_percentage ??
      course.progress ??
      0
  )

  const progress = Math.min(
    Math.max(
      Number.isFinite(progressValue)
        ? Math.round(progressValue)
        : 0,
      0
    ),
    100
  )

  const title =
    course.course_title ||
    course.title ||
    'Untitled Course'

  const description =
    course.description ||
    course.program_name ||
    course.program?.program_name ||
    'Continue your assigned learning course.'

  const isCompleted =
    course.enrollment?.status === 'completed' ||
    course.status === 'completed' ||
    progress >= 100

  function handleContinueClick() {
    if (typeof onContinue === 'function') {
      onContinue(course)
    }
  }

  return (
    <section
      className="
        grid grid-cols-1
        overflow-hidden rounded-3xl
        border border-gray-100
        bg-white shadow-sm
        sm:grid-cols-[175px_1fr]
        lg:grid-cols-[220px_1fr]
      "
    >
      <div
        className="
          flex min-h-44 items-center
          justify-center
          bg-gradient-to-br
          from-[#101d62]
          to-[#071238]
          p-6
        "
      >
        <div
          className="
            flex h-14 w-14
            items-center justify-center
            rounded-xl
            border border-white/15
            bg-white/10
            text-white
          "
        >
          <BookOpen size={26} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
        <span
          className={`
            w-fit rounded-full px-3 py-1
            text-[10px] font-bold uppercase
            tracking-wide
            ${
              isCompleted
                ? 'bg-green-50 text-green-600'
                : 'bg-brand-50 text-brand-600'
            }
          `}
        >
          {isCompleted
            ? 'Completed'
            : 'In Progress'}
        </span>

        <h2
          className="
            mt-3 truncate
            text-xl font-bold
            text-gray-900
          "
          title={title}
        >
          {title}
        </h2>

        <p
          className="
            mt-1 line-clamp-2
            text-sm text-gray-500
          "
        >
          {description}
        </p>

        <div className="mt-5">
          <div
            className="
              mb-2 flex items-center
              justify-between gap-4
              text-xs
            "
          >
            <span className="font-medium text-gray-500">
              Overall Progress
            </span>

            <span className="font-bold text-gray-900">
              {progress}%
            </span>
          </div>

          <div
            className="
              h-2 w-full overflow-hidden
              rounded-full bg-gray-100
            "
          >
            <div
              className="
                h-full rounded-full
                bg-brand-600
                transition-all duration-300
              "
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinueClick}
          className="
            mt-5 inline-flex w-fit
            cursor-pointer items-center
            justify-center gap-2
            rounded-xl bg-brand-600
            px-5 py-3
            text-sm font-semibold
            text-white transition
            hover:bg-brand-700
            focus:outline-none
            focus:ring-2
            focus:ring-brand-200
          "
        >
          {isCompleted
            ? 'View Course'
            : 'Continue Learning'}

          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  )
}