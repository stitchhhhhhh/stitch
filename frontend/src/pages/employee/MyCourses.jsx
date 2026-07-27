import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyCourses } from '../../services/courseService';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

const REQUEST_TIMEOUT_MS = 15000;

const STATUS_STYLE = {
  completed: 'bg-green-50 text-green-600',
  in_progress: 'bg-brand-50 text-brand-600',
  not_started: 'bg-gray-100 text-gray-500',
};

const STATUS_LABEL = {
  completed: 'Completed',
  in_progress: 'In Progress',
  not_started: 'Not Started',
};

const FILTERS = [
  { key: 'all', label: 'All Courses' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'not_started', label: 'Not Started' },
];

function requestWithTimeout(promise, timeoutMs = REQUEST_TIMEOUT_MS) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          'The course request timed out. Please try again.'
        )
      );
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

function MyCoursesSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      aria-label="Loading courses"
      aria-busy="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-48 rounded-lg bg-gray-200" />
          <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
        </div>

        <div className="h-10 w-96 max-w-full rounded-full bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-gray-200" />
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                </div>

                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />

                <div className="flex gap-4">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-5 w-5 rounded bg-gray-200" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-3 w-10 rounded bg-gray-200" />
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const rawProgress =
    Number(course.enrollment?.completion_percentage) || 0;

  const progress = Math.min(
    Math.max(Math.round(rawProgress), 0),
    100
  );

  const rawStatus =
    course.enrollment?.status ?? 'not_started';

  const status = STATUS_LABEL[rawStatus]
    ? rawStatus
    : 'not_started';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-brand-200 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLE[status]}`}
            >
              {STATUS_LABEL[status]}
            </span>

            {course.category && (
              <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {course.category}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-gray-900 truncate">
            {course.course_title || 'Untitled Course'}
          </h3>

          {course.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {course.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            {course.duration_hours && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {course.duration_hours} Hours
              </span>
            )}

            {course.level && (
              <span className="flex items-center gap-1">
                <BookOpen size={13} />
                {course.level}
              </span>
            )}

            {course.deadline && (
              <span className="text-amber-500 font-medium">
                Due:{' '}
                {new Date(course.deadline).toLocaleDateString(
                  'en-GB',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </span>
            )}
          </div>
        </div>

        <ChevronRight
          size={20}
          className="text-gray-300 shrink-0 mt-1"
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-gray-700">
            {progress}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor:
                status === 'completed'
                  ? '#22c55e'
                  : '#3046d6',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { user } = useAuth();
  const userId = user?.user_id;
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const loadCourses = useCallback(async () => {
    if (!userId) {
      if (isMountedRef.current) {
        setCourses([]);
        setError('');
        setLoading(false);
      }

      return;
    }

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError('');
      }

      const data = await requestWithTimeout(
        getMyCourses(userId)
      );

      if (!isMountedRef.current) {
        return;
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      console.error('MY COURSES ERROR:', err);

      setCourses([]);
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Failed to load courses.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadCourses();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadCourses]);

  const filteredCourses =
    filter === 'all'
      ? courses
      : courses.filter(
          (course) =>
            course.enrollment?.status === filter
        );

  if (loading) {
    return <MyCoursesSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
        <h2 className="font-bold">
          Courses could not be loaded
        </h2>

        <p className="text-sm mt-2">{error}</p>

        <button
          type="button"
          onClick={loadCourses}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Courses
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course
            {courses.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 text-sm gap-1">
          {FILTERS.map((filterOption) => (
            <button
              key={filterOption.key}
              type="button"
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-1.5 rounded-full font-medium transition ${
                filter === filterOption.key
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <CheckCircle2
            size={40}
            className="mb-3 opacity-30"
          />

          <p className="text-sm">
            {courses.length === 0
              ? 'No courses have been assigned to you.'
              : 'No courses in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              onClick={() =>
                navigate(
                  `/employee/courses/${course.course_id}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
