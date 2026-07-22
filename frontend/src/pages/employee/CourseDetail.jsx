import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getCourseById,
  getCourseModules,
  getLocalProgress,
  getMyCourses,
  getMaterialProgress,
  completeMaterial,
} from '../../services/courseService';
import {
  Play,
  FileText,
  HelpCircle,
  ChevronRight,
  Clock,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
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
  const userId = user?.user_id;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [activeTab, setActiveTab] = useState('Materials');
  const [loading, setLoading] = useState(true);
  const [materialProgress, setMaterialProgress] = useState([]);
  const [savingMaterial, setSavingMaterial] = useState(null);
  const [error, setError] = useState('');

useEffect(() => {
  async function load() {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [
        courseData,
        modulesData,
        myCoursesData,
        progressData,
      ] = await Promise.all([
        getCourseById(courseId),
        getCourseModules(courseId),
        getMyCourses(userId),
        getMaterialProgress(courseId),
      ]);

      const foundEnrollment =
        myCoursesData.find(
          (item) =>
            Number(item.course_id) ===
            Number(courseId)
        )?.enrollment ?? null;

      const localProgress = await getLocalProgress(
        userId,
        Number(courseId)
      );

      const progressMaterials =
        progressData?.materials ?? [];

      const progressMap = new Map(
        progressMaterials.map((material) => [
          Number(
            material.material_id ??
            material.id
          ),
          material,
        ])
      );

      const synchronizedModules = modulesData.map(
        (module) => {
          const savedProgress = progressMap.get(
            Number(module.id)
          );

          return {
            ...module,
            completed:
              savedProgress?.completed ?? false,
            completed_at:
              savedProgress?.completed_at ?? null,
          };
        }
      );

      const backendEnrollment =
        progressData?.enrollment ??
        foundEnrollment;

      const synchronizedEnrollment =
        backendEnrollment
          ? {
              ...backendEnrollment,
              completion_percentage: Number(
                backendEnrollment
                  .completion_percentage ??
                localProgress ??
                0
              ),
            }
          : null;

      setCourse(courseData);
      setModules(synchronizedModules);
      setMaterialProgress(progressMaterials);
      setEnrollment(synchronizedEnrollment);
      setInstructor(courseData.trainer || null);
    } catch (loadError) {
      console.error(
        'LOAD COURSE DETAIL ERROR:',
        loadError
      );

      setError(
        loadError.message ||
        'Gagal mengambil detail course'
      );
    } finally {
      setLoading(false);
    }
  }

  load();
}, [courseId, userId]);

async function refreshMaterialProgress() {
  const progressData =
    await getMaterialProgress(courseId);

  const progressMaterials =
    progressData?.materials ?? [];

  const progressMap = new Map(
    progressMaterials.map((material) => [
      Number(
        material.material_id ??
        material.id
      ),
      material,
    ])
  );

  setMaterialProgress(progressMaterials);

  setModules((currentModules) =>
    currentModules.map((module) => {
      const savedProgress = progressMap.get(
        Number(module.id)
      );

      return {
        ...module,
        completed:
          savedProgress?.completed ?? false,
        completed_at:
          savedProgress?.completed_at ?? null,
      };
    })
  );

  if (progressData?.enrollment) {
    setEnrollment((currentEnrollment) => ({
      ...currentEnrollment,
      ...progressData.enrollment,
      completion_percentage: Number(
        progressData.enrollment
          .completion_percentage ?? 0
      ),
    }));
  }

  return progressData;
}

async function handleCompleteMaterial(materialId) {
  if (!materialId || savingMaterial) {
    return;
  }

  try {
    setSavingMaterial(materialId);
    setError('');

    const result =
      await completeMaterial(materialId);

    await refreshMaterialProgress();

    if (result?.enrollment) {
      setEnrollment((currentEnrollment) => ({
        ...currentEnrollment,
        ...result.enrollment,
        completion_percentage: Number(
          result.enrollment
            .completion_percentage ?? 0
        ),
      }));
    }
  } catch (completeError) {
    console.error(
      'COMPLETE MATERIAL ERROR:',
      completeError
    );

    setError(
      completeError.message ||
      'Gagal menandai material selesai'
    );
  } finally {
    setSavingMaterial(null);
  }
}

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

  const progress = Number(
  enrollment?.completion_percentage ?? 0
);

const completedMaterials =
  modules.filter(
    (module) => module.completed
  ).length;

const totalMaterials = modules.length;

const allMaterialsCompleted =
  totalMaterials > 0 &&
  completedMaterials === totalMaterials;

const materialPercentage =
  totalMaterials > 0
    ? Math.round(
        (completedMaterials / totalMaterials) * 100
      )
    : 0;

  return (
    <div>
      {/* Back button */}
      <button
  onClick={() => navigate('/employee/courses')}
  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-5 transition-colors"
>
  <ArrowLeft size={16} />
  Back to My Courses
</button>

{error && (
  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
    {error}
  </div>
)}

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
  <div className="space-y-3">
    {modules.length === 0 ? (
      <p className="text-sm text-gray-400">
        No materials available yet.
      </p>
    ) : (
      modules.map((material) => {
        const MaterialIcon =
          MATERIAL_ICON[
            material.material_type
          ] ?? FileText;

        const isSaving =
          savingMaterial === material.id;

        return (
          <div
            key={material.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
              material.completed
                ? 'border-green-200 bg-green-50/50'
                : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                material.completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-brand-50 text-brand-600'
              }`}
            >
              {material.completed ? (
                <CheckCircle size={18} />
              ) : (
                <MaterialIcon size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">
                {material.material_title}
              </p>

              <p className="mt-1 text-xs capitalize text-gray-400">
                {material.material_type}
              </p>

              {material.completed &&
                material.completed_at && (
                  <p className="mt-1 text-xs text-green-600">
                    Completed on{' '}
                    {new Date(
                      material.completed_at
                    ).toLocaleDateString(
                      'en-GB',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </p>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {material.file_url && (
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Open
                  <ExternalLink size={13} />
                </a>
              )}

              {material.completed ? (
                <span className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                  <CheckCircle size={14} />
                  Completed
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    handleCompleteMaterial(
                      material.id
                    )
                  }
                  className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? 'Saving...'
                    : 'Mark as Complete'}
                </button>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
)}

{activeTab === 'Assessment' && (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {allMaterialsCompleted ? (
      <>
        <CheckCircle
          size={40}
          className="mb-3 text-green-500"
        />

        <p className="text-sm font-semibold text-gray-700">
          Assessment Unlocked
        </p>

        <p className="mt-1 text-xs text-gray-400">
          You have completed all course
          materials.
        </p>

        <button
          onClick={() =>
            navigate(
              `/employee/courses/${courseId}/assessment`
            )
          }
          className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Start Assessment
        </button>
      </>
    ) : (
      <>
        <HelpCircle
          size={40}
          className="mb-3 text-gray-300"
        />

        <p className="text-sm font-semibold text-gray-600">
          Assessment Locked
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Complete all materials to unlock
          the assessment.
        </p>

        <p className="mt-3 text-xs font-semibold text-brand-600">
          {completedMaterials} of{' '}
          {totalMaterials} materials completed
        </p>

        <button
          type="button"
          disabled
          className="mt-4 cursor-not-allowed rounded-xl bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-400"
        >
          Assessment Locked
        </button>
      </>
    )}
  </div>
)}

{activeTab === 'Progress Details' && (
  <div className="space-y-4">
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">
        Overall Completion
      </span>

      <span className="font-bold text-gray-900">
        {progress}%
      </span>
    </div>

    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className="h-2 rounded-full bg-brand-600 transition-all"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>

    <div className="flex justify-between text-xs text-gray-500">
      <span>Materials completed</span>

      <span className="font-semibold text-gray-700">
        {completedMaterials} / {totalMaterials}
      </span>
    </div>

    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className="h-2 rounded-full bg-green-500 transition-all"
        style={{
          width: `${materialPercentage}%`,
        }}
      />
    </div>

    <p className="text-xs text-gray-400">
      Materials contribute up to 90% of the course
      progress. Passing the assessment completes the
      course.
    </p>

    <p className="text-xs text-gray-400">
      Enrolled:{' '}
      {enrollment?.assigned_date
        ? new Date(
            enrollment.assigned_date
          ).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '—'}
    </p>
  </div>
)}

        {/* Right — course progress panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
              Course Progress
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{progress}%</span>
              <span className="text-xs text-gray-400">
                {completedMaterials} of {totalMaterials} materials
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
                    </div>
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
