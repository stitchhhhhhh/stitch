import { useNavigate } from 'react-router-dom';
import { Clock, Play } from 'lucide-react';

function CourseCard({ course, onStart }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 h-32 flex items-center justify-center relative">
        {course.category && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide bg-white/90 text-gray-700 px-2 py-1 rounded-full">
            {course.category}
          </span>
        )}
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20" />
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{course.course_title}</h4>
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
          <Clock size={12} />
          {course.duration_hours ?? '–'} Hours &bull; {course.level ?? 'All levels'}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onStart(course)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
          >
            <Play size={12} />
            Start Module
          </button>
          <span className="text-xs text-gray-400">0% Progress</span>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedCourses({ courses = [] }) {
  const navigate = useNavigate();

  if (courses.length === 0) return null;

  function handleStart(course) {
    navigate(`/employee/courses/${course.course_id}`);
  }

  function handleViewAll() {
    navigate('/employee/courses');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Recommended For You</h3>
        <button
          type="button"
          onClick={handleViewAll}
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          View All Courses
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.course_id} course={course} onStart={handleStart} />
        ))}
      </div>
    </div>
  );
}
