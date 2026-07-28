import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Lock,
  Play,
  Presentation,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import {
  getCourseById,
  getCourseModules,
  getMyCourses,
  updateCourseProgress,
} from '../../services/courseService';

import {
  generateCertificate,
} from '../../services/userService';

const REQUEST_TIMEOUT_MS = 15000;

const TABS = [
  'Materials',
  'Assessment',
  'Progress Details',
];

const MATERIAL_ICON = {
  video: Play,
  pdf: FileText,
  document: FileText,
  doc: FileText,
  presentation: Presentation,
  quiz: HelpCircle,
};

function requestWithTimeout(
  promise,
  timeoutMs = REQUEST_TIMEOUT_MS
) {
  let timeoutId;

  const timeoutPromise = new Promise(
    (_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(
          new Error(
            'The course request timed out. Please try again.'
          )
        );
      }, timeoutMs);
    }
  );

  return Promise.race([
    promise,
    timeoutPromise,
  ]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

function normalizeProgress(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(
    Math.max(
      Math.round(numericValue),
      0
    ),
    100
  );
}

function getMaterialIcon(materialType) {
  const normalizedType = String(
    materialType || ''
  ).toLowerCase();

  return (
    MATERIAL_ICON[normalizedType] ||
    FileText
  );
}

function getMaterialTypeLabel(
  materialType
) {
  const normalizedType = String(
    materialType || ''
  ).toLowerCase();

  const labels = {
    video: 'Video',
    pdf: 'PDF Document',
    document: 'Document',
    doc: 'Document',
    presentation: 'Presentation',
    quiz: 'Quiz',
  };

  return (
    labels[normalizedType] ||
    'Learning Material'
  );
}

function getCompletedMaterialKey(
  userId,
  courseId
) {
  return `completed_materials_${userId}_${courseId}`;
}

function readCompletedMaterialIds(
  userId,
  courseId
) {
  try {
    const storedValue =
      localStorage.getItem(
        getCompletedMaterialKey(
          userId,
          courseId
        )
      );

    const parsedValue =
      storedValue
        ? JSON.parse(storedValue)
        : [];

    return new Set(
      Array.isArray(parsedValue)
        ? parsedValue
            .map(Number)
            .filter(
              (value) =>
                Number.isInteger(value) &&
                value > 0
            )
        : []
    );
  } catch {
    return new Set();
  }
}

function saveCompletedMaterialIds(
  userId,
  courseId,
  completedMaterialIds
) {
  localStorage.setItem(
    getCompletedMaterialKey(
      userId,
      courseId
    ),
    JSON.stringify(
      Array.from(
        completedMaterialIds
      )
    )
  );
}

function getMaterialId(material) {
  const materialId = Number(
    material?.id ??
      material?.module_id
  );

  return Number.isInteger(materialId) &&
    materialId > 0
    ? materialId
    : null;
}

function getMaterialType(material) {
  return String(
    material?.material_type || ''
  )
    .trim()
    .toUpperCase();
}

function isPdfMaterial(material) {
  const materialType =
    getMaterialType(material);

  const fileUrl = String(
    material?.file_url || ''
  ).toLowerCase();

  return (
    materialType === 'PDF' ||
    fileUrl.includes('.pdf')
  );
}

function isVideoMaterial(material) {
  return (
    getMaterialType(material) ===
    'VIDEO'
  );
}

function CourseDetailSkeleton() {
  return (
    <div
      className="animate-pulse"
      aria-label="Loading course details"
      aria-busy="true"
    >
      <div className="mb-5 h-5 w-40 rounded bg-gray-200" />

      <div className="mb-6 rounded-2xl bg-gray-200 p-8">
        <div className="mb-4 h-6 w-28 rounded-full bg-gray-300" />
        <div className="mb-3 h-9 w-2/3 rounded bg-gray-300" />
        <div className="mb-2 h-4 w-full max-w-xl rounded bg-gray-300" />
        <div className="h-4 w-3/4 max-w-lg rounded bg-gray-300" />

        <div className="mt-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />

          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-gray-300" />
            <div className="h-4 w-32 rounded bg-gray-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex gap-6 border-b border-gray-100 px-6 py-4">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>

          <div className="space-y-3 p-6">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl p-3"
              >
                <div className="h-9 w-9 rounded-xl bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                </div>

                <div className="h-4 w-4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 h-3 w-28 rounded bg-gray-200" />
          <div className="mb-3 h-9 w-24 rounded bg-gray-200" />
          <div className="mb-4 h-2 w-full rounded bg-gray-200" />
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  title,
  message,
  onRetry,
  onBack,
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="font-bold">
        {title}
      </h2>

      <p className="mt-2 text-sm">
        {message}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-red-300 px-4 py-2 transition hover:bg-red-100"
        >
          Back to My Courses
        </button>
      </div>
    </div>
  );
}

function MaterialViewer({
  material,
  completed,
  completing,
  onClose,
  onComplete,
}) {
  if (!material) {
    return null;
  }

  const materialTitle =
    material.material_title ||
    'Untitled Material';

  const materialTypeLabel =
    getMaterialTypeLabel(
      material.material_type
    );

  const videoMaterial =
    isVideoMaterial(material);

  const pdfMaterial =
    isPdfMaterial(material);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-5">
      <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-900">
              {materialTitle}
            </h2>

            <p className="text-xs text-gray-500">
              {materialTypeLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-100"
            aria-label="Close material viewer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-gray-100 p-3 sm:p-5">
          {videoMaterial ? (
            <div className="flex h-full items-center justify-center overflow-hidden rounded-xl bg-black">
              <video
                controls
                controlsList="nodownload"
                src={material.file_url}
                className="max-h-full w-full"
                onEnded={() => {
                  if (!completed) {
                    onComplete();
                  }
                }}
              >
                Your browser does not support video playback.
              </video>
            </div>
          ) : pdfMaterial ? (
            <iframe
              title={materialTitle}
              src={material.file_url}
              className="h-full w-full rounded-xl border border-gray-200 bg-white"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 text-center">
              <FileText
                size={48}
                className="mb-4 text-gray-300"
              />

              <h3 className="font-semibold text-gray-800">
                Preview is not available
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                This file type cannot be previewed directly in the browser.
              </p>

              <a
                href={material.file_url}
                download
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <Download size={16} />
                Download Material
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-gray-500">
            {videoMaterial
              ? 'The video will be marked as completed after playback reaches the end.'
              : 'Mark this material as completed after you finish studying it.'}
          </p>

          <button
            type="button"
            onClick={onComplete}
            disabled={
              completed ||
              completing
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              completed
                ? 'cursor-default bg-green-100 text-green-700'
                : completing
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            <CheckCircle2 size={17} />

            {completed
              ? 'Completed'
              : completing
                ? 'Updating...'
                : 'Mark as Completed'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { courseId } =
    useParams();

  const { user } =
    useAuth();

  const navigate =
    useNavigate();

  const isMountedRef =
    useRef(true);

  const userId = Number(
    user?.user_id ||
      user?.id
  );

  const numericCourseId =
    Number(courseId);

  const [course, setCourse] =
    useState(null);

  const [enrollment, setEnrollment] =
    useState(null);

  const [modules, setModules] =
    useState([]);

  const [
    completedMaterialIds,
    setCompletedMaterialIds,
  ] = useState(new Set());

  const [
    selectedMaterial,
    setSelectedMaterial,
  ] = useState(null);

  const [
    progressUpdating,
    setProgressUpdating,
  ] = useState(false);

  const [activeTab, setActiveTab] =
    useState('Materials');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [
    accessDenied,
    setAccessDenied,
  ] = useState(false);

  const loadCourse = useCallback(
    async () => {
      if (
        !Number.isInteger(userId) ||
        userId <= 0 ||
        !Number.isInteger(
          numericCourseId
        ) ||
        numericCourseId <= 0
      ) {
        if (
          isMountedRef.current
        ) {
          setCourse(null);
          setEnrollment(null);
          setModules([]);
          setAccessDenied(false);

          setError(
            !Number.isInteger(
              userId
            ) ||
              userId <= 0
              ? 'Your user session could not be identified.'
              : 'The course ID is invalid.'
          );

          setLoading(false);
        }

        return;
      }

      try {
        if (
          isMountedRef.current
        ) {
          setLoading(true);
          setError('');
          setAccessDenied(false);
        }

        const myCoursesData =
          await requestWithTimeout(
            getMyCourses(userId)
          );

        if (
          !isMountedRef.current
        ) {
          return;
        }

        const enrolledCourse =
          Array.isArray(
            myCoursesData
          )
            ? myCoursesData.find(
                (item) =>
                  Number(
                    item.course_id
                  ) ===
                  numericCourseId
              )
            : null;

        if (
          !enrolledCourse?.enrollment
        ) {
          setCourse(null);
          setEnrollment(null);
          setModules([]);
          setAccessDenied(true);
          return;
        }

        const [
          courseResult,
          modulesResult,
        ] =
          await Promise.allSettled([
            requestWithTimeout(
              getCourseById(
                numericCourseId
              )
            ),
            requestWithTimeout(
              getCourseModules(
                numericCourseId
              )
            ),
          ]);

        if (
          !isMountedRef.current
        ) {
          return;
        }

        if (
          courseResult.status ===
          'rejected'
        ) {
          throw courseResult.reason;
        }

        const courseData =
          courseResult.value;

        const modulesData =
          modulesResult.status ===
            'fulfilled' &&
          Array.isArray(
            modulesResult.value
          )
            ? modulesResult.value
            : [];

        setCourse(
          courseData || null
        );

        setModules(
          modulesData
        );

        setEnrollment({
          ...enrolledCourse.enrollment,
          completion_percentage:
            enrolledCourse.enrollment
              .completion_percentage ??
            0,
        });

        setCompletedMaterialIds(
          readCompletedMaterialIds(
            userId,
            numericCourseId
          )
        );

        if (
          modulesResult.status ===
          'rejected'
        ) {
          console.error(
            'COURSE MODULES ERROR:',
            modulesResult.reason
          );
        }
      } catch (loadError) {
        if (
          !isMountedRef.current
        ) {
          return;
        }

        console.error(
          'COURSE DETAIL ERROR:',
          loadError
        );

        setCourse(null);
        setEnrollment(null);
        setModules([]);

        setError(
          loadError instanceof
            Error &&
            loadError.message
            ? loadError.message
            : 'Failed to load the course details.'
        );
      } finally {
        if (
          isMountedRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [
      numericCourseId,
      userId,
    ]
  );

  useEffect(() => {
    isMountedRef.current = true;

    loadCourse();

    return () => {
      isMountedRef.current =
        false;
    };
  }, [loadCourse]);

  useEffect(() => {
    if (!selectedMaterial) {
      return undefined;
    }

    const handleEscape =
      (event) => {
        if (
          event.key ===
          'Escape'
        ) {
          setSelectedMaterial(
            null
          );
        }
      };

    document.body.style.overflow =
      'hidden';

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        '';

      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [selectedMaterial]);

  const markMaterialCompleted =
    useCallback(
      async (material) => {
        const materialId =
          getMaterialId(
            material
          );

        if (
          !materialId ||
          completedMaterialIds.has(
            materialId
          ) ||
          progressUpdating
        ) {
          return;
        }

        const availableMaterials =
          modules.filter(
            (item) =>
              Boolean(
                item.file_url
              )
          );

        if (
          availableMaterials.length ===
          0
        ) {
          return;
        }

        const nextCompletedIds =
          new Set(
            completedMaterialIds
          );

        nextCompletedIds.add(
          materialId
        );

        const completedCount =
          availableMaterials.filter(
            (item) =>
              nextCompletedIds.has(
                getMaterialId(
                  item
                )
              )
          ).length;

        const nextProgress =
          Math.min(
            Math.round(
              (completedCount /
                availableMaterials.length) *
                100
            ),
            100
          );

        try {
          setProgressUpdating(
            true
          );

          await updateCourseProgress(
            userId,
            numericCourseId,
            nextProgress
          );

          if (nextProgress >= 100) {
  try {
    await generateCertificate(numericCourseId);
  } catch (error) {
    // Ignore duplicate certificate
    if (
      !(error instanceof Error) ||
      !error.message.includes('already been generated')
    ) {
      console.error(
        'GENERATE CERTIFICATE ERROR:',
        error
      );
    }
  }
}

          if (
            !isMountedRef.current
          ) {
            return;
          }

          setCompletedMaterialIds(
            nextCompletedIds
          );

          saveCompletedMaterialIds(
            userId,
            numericCourseId,
            nextCompletedIds
          );

          setEnrollment(
            (current) => ({
              ...current,
              completion_percentage:
                nextProgress,
              status:
                nextProgress >= 100
                  ? 'completed'
                  : nextProgress > 0
                    ? 'in_progress'
                    : 'not_started',
            })
          );

          setError('');
        } catch (
          updateError
        ) {
          console.error(
            'UPDATE MATERIAL PROGRESS ERROR:',
            updateError
          );

          setError(
            updateError instanceof
              Error &&
              updateError.message
              ? updateError.message
              : 'Failed to update learning progress.'
          );
        } finally {
          if (
            isMountedRef.current
          ) {
            setProgressUpdating(
              false
            );
          }
        }
      },
      [
        completedMaterialIds,
        modules,
        numericCourseId,
        progressUpdating,
        userId,
      ]
    );

  function openMaterial(
    material
  ) {
    if (
      !material?.file_url
    ) {
      return;
    }

    setSelectedMaterial(
      material
    );
  }

  function handleContinueLearning() {
    const availableMaterials =
      modules.filter(
        (material) =>
          Boolean(
            material.file_url
          )
      );

    const nextMaterial =
      availableMaterials.find(
        (material) => {
          const materialId =
            getMaterialId(
              material
            );

          return (
            materialId &&
            !completedMaterialIds.has(
              materialId
            )
          );
        }
      ) ||
      availableMaterials[0];

    setActiveTab(
      'Materials'
    );

    if (nextMaterial) {
      setSelectedMaterial(
        nextMaterial
      );
    }
  }

  if (loading) {
    return (
      <CourseDetailSkeleton />
    );
  }

  if (accessDenied) {
    return (
      <ErrorState
        title="Course access unavailable"
        message="You are not enrolled in this course."
        onBack={() =>
          navigate(
            '/employee/courses'
          )
        }
      />
    );
  }

  if (error && !course) {
    return (
      <ErrorState
        title="Course details could not be loaded"
        message={error}
        onRetry={loadCourse}
        onBack={() =>
          navigate(
            '/employee/courses'
          )
        }
      />
    );
  }

  if (!course) {
    return (
      <ErrorState
        title="Course not found"
        message="The requested course is unavailable."
        onRetry={loadCourse}
        onBack={() =>
          navigate(
            '/employee/courses'
          )
        }
      />
    );
  }

  const progress =
    normalizeProgress(
      enrollment
        ?.completion_percentage
    );

  const availableMaterials =
    modules.filter(
      (material) =>
        Boolean(
          material.file_url
        )
    );

  const moduleCount =
    availableMaterials.length;

  const completedModuleCount =
    availableMaterials.filter(
      (material) => {
        const materialId =
          getMaterialId(
            material
          );

        return (
          materialId &&
          completedMaterialIds.has(
            materialId
          )
        );
      }
    ).length;

  const instructor =
    course.trainer || null;

  const assessments =
    Array.isArray(
      course.assessments
    )
      ? course.assessments
      : [];

  const hasAssessment =
    assessments.length > 0;

  const selectedMaterialId =
    getMaterialId(
      selectedMaterial
    );

  const selectedMaterialCompleted =
    selectedMaterialId
      ? completedMaterialIds.has(
          selectedMaterialId
        )
      : false;

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(
              '/employee/courses'
            )
          }
          className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </button>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-10" />

          <div className="relative">
            {course.level && (
              <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                {course.level}
              </span>
            )}

            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {course.course_title ||
                'Untitled Course'}
            </h1>

            {course.description && (
              <p className="max-w-xl text-sm leading-relaxed text-white/75">
                {course.description}
              </p>
            )}

            {instructor?.full_name && (
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {instructor.full_name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-xs text-white/60">
                    Lead Instructor
                  </p>

                  <p className="text-sm font-semibold">
                    {
                      instructor.full_name
                    }
                  </p>

                  {instructor.title && (
                    <p className="text-xs text-white/60">
                      {
                        instructor.title
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex overflow-x-auto border-b border-gray-100 px-6">
              {TABS.map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab
                      )
                    }
                    className={`mr-6 whitespace-nowrap border-b-2 px-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="p-6">
              {activeTab ===
                'Materials' && (
                <div className="space-y-3">
                  {modules.length ===
                  0 ? (
                    <p className="text-sm text-gray-400">
                      No materials are available yet.
                    </p>
                  ) : (
                    modules.map(
                      (
                        material
                      ) => {
                        const MaterialIcon =
                          getMaterialIcon(
                            material.material_type
                          );

                        const materialLabel =
                          getMaterialTypeLabel(
                            material.material_type
                          );

                        const hasFile =
                          Boolean(
                            material.file_url
                          );

                        const materialId =
                          getMaterialId(
                            material
                          );

                        const completed =
                          materialId
                            ? completedMaterialIds.has(
                                materialId
                              )
                            : false;

                        return (
                          <button
                            key={
                              materialId ||
                              material.material_title
                            }
                            type="button"
                            onClick={() =>
                              hasFile
                                ? openMaterial(
                                    material
                                  )
                                : undefined
                            }
                            disabled={
                              !hasFile
                            }
                            className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                              hasFile
                                ? 'cursor-pointer hover:bg-gray-50'
                                : 'cursor-not-allowed opacity-60'
                            }`}
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                              <MaterialIcon
                                size={16}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">
                                {material.material_title ||
                                  'Untitled Material'}
                              </p>

                              <p className="text-xs text-gray-400">
                                {
                                  materialLabel
                                }
                              </p>
                            </div>

                            {completed && (
                              <span className="text-xs font-semibold text-green-600">
                                Completed
                              </span>
                            )}

                            {hasFile ? (
                              <ChevronRight
                                size={16}
                              />
                            ) : (
                              <Lock
                                size={15}
                                className="text-gray-300"
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  )}
                </div>
              )}

              {activeTab ===
                'Assessment' && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                  <HelpCircle
                    size={40}
                    className="mb-3 opacity-30"
                  />

                  <p className="text-sm font-medium text-gray-600">
                    Assessment
                  </p>

                  {!hasAssessment ? (
                    <p className="mt-1 text-xs">
                      No assessment is available for this course yet.
                    </p>
                  ) : progress <
                    100 ? (
                    <>
                      <p className="mt-1 text-xs">
                        Complete the course materials before starting the assessment.
                      </p>

                      <button
                        type="button"
                        disabled
                        className="mt-4 cursor-not-allowed rounded-xl bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-500"
                      >
                        Assessment Locked
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/employee/courses/${numericCourseId}/assessment`
                        )
                      }
                      className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      Start Assessment
                    </button>
                  )}
                </div>
              )}

              {activeTab ===
                'Progress Details' && (
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
                      className="h-2 rounded-full bg-brand-600"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-gray-400">
                    Enrolled:{' '}
                    {enrollment
                      ?.assigned_date
                      ? new Date(
                          enrollment.assigned_date
                        ).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month:
                              'long',
                            year: 'numeric',
                          }
                        )
                      : '—'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                Course Progress
              </p>

              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {progress}%
                </span>

                <span className="text-xs text-gray-400">
                  {moduleCount ===
                  0
                    ? 'No modules available'
                    : `${completedModuleCount} of ${moduleCount} module${
                        moduleCount !==
                        1
                          ? 's'
                          : ''
                      }`}
                </span>
              </div>

              <div className="mb-4 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-brand-600"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={
                  handleContinueLearning
                }
                disabled={
                  moduleCount === 0 ||
                  progressUpdating
                }
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
                  moduleCount > 0 &&
                  !progressUpdating
                    ? 'cursor-pointer bg-brand-600 text-white hover:bg-brand-700'
                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                }`}
              >
                {progressUpdating
                  ? 'Updating Progress...'
                  : 'Continue Learning'}

                <ChevronRight
                  size={16}
                />
              </button>

              {course.deadline && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <Clock size={13} />

                  Due{' '}
                  {new Date(
                    course.deadline
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
          </div>
        </div>
      </div>

      <MaterialViewer
        material={
          selectedMaterial
        }
        completed={
          selectedMaterialCompleted
        }
        completing={
          progressUpdating
        }
        onClose={() =>
          setSelectedMaterial(
            null
          )
        }
        onComplete={() =>
          markMaterialCompleted(
            selectedMaterial
          )
        }
      />
    </>
  );
}