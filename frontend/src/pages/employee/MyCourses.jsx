import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyCourses } from '../../services/courseService';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

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

function CourseCard({ course, onClick }) {
  const progress = course.enrollment?.completion_percentage ?? 0;
  const status = course.enrollment?.status ?? 'not_started';

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
            {course.course_title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            {course.duration_hours && (
              <span className="flex items-center gap-1">
                <Clock size={13} /> {course.duration_hours} Hours
              </span>
            )}
            {course.level && (
              <span className="flex items-center gap-1">
                <BookOpen size={13} /> {course.level}
              </span>
            )}
            {course.deadline && (
              <span className="text-amber-500 font-medium">
                Due: {new Date(course.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <ChevronRight size={20} className="text-gray-300 shrink-0 mt-1" />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: status === 'completed' ? '#22c55e' : '#3046d6',
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

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      if (!userId) {
        if (isMounted) {
          setCourses([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await Promise.race([
  getMyCourses(userId),

  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "Request courses terlalu lama. Silakan coba kembali."
          )
        ),
      15000
    )
  ),
]);

        if (isMounted) {
          setCourses(
            Array.isArray(data) ? data : []
          );
        }
      } catch (err) {
        if (!isMounted) return;

        console.error('MY COURSES ERROR:', err);

        setError(
          err?.message || 'Failed to load courses.'
        );

        setCourses([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

   async function loadCourses() {
  if (!userId) {
    if (isMounted) {
      setCourses([]);
      setLoading(false);
    }
    return;
  }

  try {
    setLoading(true);
    setError("");

    console.log("Loading courses for user:", userId);

    const data = await Promise.race([
      getMyCourses(userId),

      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Request courses terlalu lama."
              )
            ),
          15000
        )
      ),
    ]);

    console.log("MY COURSES RESPONSE:", data);

    if (!isMounted) return;

    setCourses(
      Array.isArray(data) ? data : []
    );
  } catch (err) {
    if (!isMounted) return;

    console.error("MY COURSES ERROR:", err);

    setError(
      err?.message ||
        "Failed to load courses."
    );

    setCourses([]);
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
}

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const FILTERS = [
    { key: 'all', label: 'All Courses' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'not_started', label: 'Not Started' },
  ];

  const filtered =
    filter === 'all'
      ? courses
      : courses.filter((c) => c.enrollment?.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading courses...
      </div>
    );
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
          onClick={() => window.location.reload()}
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
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 text-sm gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full font-medium transition ${
                filter === f.key
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <CheckCircle2 size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No courses in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              onClick={() => navigate(`/employee/courses/${course.course_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}