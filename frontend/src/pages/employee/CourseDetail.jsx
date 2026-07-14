import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseById, getCourseModules, getCourseInstructor, getLocalProgress, getMyCourses } from '../../services/courseService';
import {
  Play, FileText, Presentation, HelpCircle,
  Download, ChevronRight, Lock, Clock, ArrowLeft
} from 'lucide-react';

const MATERIAL_ICON = {
  video: Play,
  pdf: FileText,
  presentation: FileText,
  quiz: HelpCircle,
};

const MATERIAL_META = (m) => {
  if (m.material_type === 'video') return `Video Lesson • ${m.duration}`;
  if (m.material_type === 'pdf') return `PDF Document • ${m.file_size}`;
  if (m.material_type === 'presentation') return `Presentation • ${m.slides} Slides`;
  if (m.material_type === 'quiz') return 'Quiz';
  return '';
};

const TABS = ['Materials', 'Assessment', 'Progress Details'];

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const userId = user?.user_id ?? 1;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [activeTab, setActiveTab] = useState('Materials');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [courseData, modulesData, myCoursesData] = await Promise.all([
        getCourseById(courseId),
        getCourseModules(courseId),
        getMyCourses(userId),
      ]);

      const foundEnrollment = myCoursesData.find(
        (c) => c.course_id === Number(courseId)
      )?.enrollment ?? null;

      const localProgress = await getLocalProgress(userId, Number(courseId));
      const myEnrollment = foundEnrollment
        ? {
            ...foundEnrollment,
            completion_percentage: localProgress ?? foundEnrollment.completion_percentage,
          }
        : null;

      const instructorData = courseData.trainer_id
        ? await getCourseInstructor(courseData.trainer_id)
        : null;

      setCourse(courseData);
      setModules(modulesData);
      setEnrollment(myEnrollment);
      setInstructor(instructorData);
      setLoading(false);
    }
    load();
  }, [courseId, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Course not found.
      </div>
    );
  }

  const progress = enrollment?.completion_percentage ?? 0;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/employee/courses')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Courses
      </button>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-4">
            Level 3 • {course.level ?? 'Advanced'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{course.course_title}</h1>
          <p className="text-white/75 text-sm leading-relaxed max-w-xl">{course.description}</p>

          {instructor && (
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                {instructor.full_name[0]}
              </div>
              <div>
                <p className="text-xs text-white/60">Lead Instructor</p>
                <p className="text-sm font-semibold">{instructor.full_name}</p>
                <p className="text-xs text-white/60">{instructor.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left — tabs & content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 mr-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Materials' && (
              <div className="space-y-6">
                {modules.length === 0 && (
                  <p className="text-sm text-gray-400">No materials available yet.</p>
                )}
                {modules.map((mod) => (
                  <div key={mod.module_id}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-gray-900">
                        {mod.module_title}
                      </h3>
                      {mod.is_locked ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <Lock size={13} /> Locked
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {mod.materials.length} Materials
                        </span>
                      )}
                    </div>

                    {mod.is_locked ? (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                        <Lock size={24} className="mb-2 opacity-40" />
                        <p className="text-sm">Complete {modules[mod.order - 2]?.module_title ?? 'previous module'} to unlock advanced content</p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {mod.materials.map((mat) => {
                          const Icon = MATERIAL_ICON[mat.material_type] ?? FileText;
                          return (
                            <li
                              key={mat.material_id}
                              onClick={() => {
                                if (mat.material_type === 'quiz') {
                                  navigate(`/employee/courses/${courseId}/assessment`);
                                }
                              }}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                                mat.material_type === 'quiz'
                                  ? 'hover:bg-brand-50 cursor-pointer'
                                  : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                <Icon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {mat.material_title}
                                </p>
                                <p className="text-xs text-gray-400">{MATERIAL_META(mat)}</p>
                              </div>
                              {mat.material_type === 'pdf' ? (
                                <Download
                                  size={16}
                                  className="text-gray-300 group-hover:text-brand-500 transition-colors shrink-0"
                                />
                              ) : (
                                <ChevronRight
                                  size={16}
                                  className="text-gray-300 group-hover:text-brand-500 transition-colors shrink-0"
                                />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Assessment' && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <HelpCircle size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium text-gray-600">Assessment</p>
                <p className="text-xs mt-1">Complete all materials to unlock the assessment.</p>
                <button
                  onClick={() => navigate(`/employee/courses/${courseId}/assessment`)}
                  className="mt-4 bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            )}

            {activeTab === 'Progress Details' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Overall Completion</span>
                  <span className="font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-brand-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Enrolled:{' '}
                  {enrollment?.assigned_date
                    ? new Date(enrollment.assigned_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — course progress panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
              Course Progress
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{progress}%</span>
              <span className="text-xs text-gray-400">
                {Math.round((progress / 100) * 8)} of 8 modules
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
              <div
                className="h-2 bg-brand-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={() => setActiveTab('Materials')}
              className="w-full bg-brand-600 text-white text-sm font-semibold rounded-xl py-3 hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue Learning <ChevronRight size={16} />
            </button>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 justify-center">
              <Clock size={13} /> Est. time remaining: 3h 15m
            </p>
          </div>

          {/* Recommended add-on */}
          <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/60 mb-2">
              Recommended
            </p>
            <p className="text-sm font-bold">Agile Leadership Add-on</p>
            <p className="text-xs text-white/60 mt-1">Expand your certification</p>
          </div>
        </div>
      </div>
    </div>
  );
}