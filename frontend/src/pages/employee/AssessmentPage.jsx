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
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  HelpCircle,
  RefreshCw,
  Send,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import {
  getAssessmentByCourseId,
  getCourseById,
  getMyCourses,
  submitAssessmentResult,
  updateEnrollmentProgress,
} from '../../services/courseService';

import {
  generateCertificate,
} from '../../services/userService';

const REQUEST_TIMEOUT = 15000;

function requestWithTimeout(
  promise,
  timeoutMessage = 'The request timed out'
) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(new Error(timeoutMessage));
      }, REQUEST_TIMEOUT);

      Promise.resolve(promise).finally(() => {
        window.clearTimeout(timeoutId);
      });
    }),
  ]);
}

function formatTime(seconds) {
  const safeSeconds = Math.max(
    Number(seconds) || 0,
    0
  );

  const minutes = Math.floor(
    safeSeconds / 60
  )
    .toString()
    .padStart(2, '0');

  const remainingSeconds = (
    safeSeconds % 60
  )
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

function getErrorMessage(
  error,
  fallbackMessage
) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
}

function AssessmentSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="flex items-center gap-3 mb-7">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-3 w-3 rounded bg-gray-200" />
        <div className="h-3 w-32 rounded bg-gray-200" />
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-3">
          <div className="h-7 w-64 rounded bg-gray-200" />
          <div className="h-4 w-80 max-w-full rounded bg-gray-100" />
        </div>

        <div className="h-10 w-28 rounded-xl bg-gray-200" />
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <div className="h-3 w-28 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>

        <div className="h-2 w-full rounded bg-gray-200" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="h-5 w-11/12 rounded bg-gray-200 mb-6" />

        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-14 w-full rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageState({
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          {message}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
          >
            <RefreshCw size={15} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const mountedRef = useRef(true);
  const timerRef = useRef(null);
  const submittingRef = useRef(false);

  const [assessment, setAssessment] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [course, setCourse] =
    useState(null);

  const [enrollment, setEnrollment] =
    useState(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [flagged, setFlagged] =
    useState({});

  const [timeLeft, setTimeLeft] =
    useState(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [accessDenied, setAccessDenied] =
    useState(false);

  const normalizedCourseId =
    Number(courseId);

  const userId =
    Number(user?.user_id || user?.id);

  const loadAssessment = useCallback(
    async () => {
      if (
        !Number.isInteger(normalizedCourseId) ||
        normalizedCourseId <= 0
      ) {
        setError('Invalid course ID.');
        setLoading(false);
        return;
      }

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        setError(
          'Your session is unavailable. Please sign in again.'
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setAccessDenied(false);

      try {
        const [
          assessmentData,
          courseData,
          enrolledCourses,
        ] = await requestWithTimeout(
          Promise.all([
            getAssessmentByCourseId(
              normalizedCourseId
            ),
            getCourseById(
              normalizedCourseId
            ),
            getMyCourses(userId),
          ]),
          'Loading the assessment took too long. Please try again.'
        );

        if (!mountedRef.current) {
          return;
        }

        const enrolledCourse =
          Array.isArray(enrolledCourses)
            ? enrolledCourses.find(
                (item) =>
                  Number(item.course_id) ===
                  normalizedCourseId
              )
            : null;

        const enrollmentData =
          enrolledCourse?.enrollment;

        if (!enrollmentData) {
          setAccessDenied(true);
          setAssessment(null);
          setQuestions([]);
          setCourse(courseData || null);
          setEnrollment(null);
          return;
        }

        setEnrollment(enrollmentData);
        setCourse(courseData || null);

        if (!assessmentData) {
          setAssessment(null);
          setQuestions([]);
          setTimeLeft(null);
          return;
        }

        const assessmentQuestions =
          Array.isArray(
            assessmentData.questions
          )
            ? assessmentData.questions
            : [];

        const durationMinutes =
          Number(
            assessmentData.duration_minutes
          );

        setAssessment(assessmentData);
        setQuestions(assessmentQuestions);
        setCurrentIndex(0);
        setAnswers({});
        setFlagged({});
        setSubmitted(false);
        setResult(null);

        setTimeLeft(
          Number.isFinite(durationMinutes) &&
            durationMinutes > 0
            ? Math.round(
                durationMinutes * 60
              )
            : 30 * 60
        );
      } catch (loadError) {
        if (!mountedRef.current) {
          return;
        }

        setError(
          getErrorMessage(
            loadError,
            'Failed to load the assessment.'
          )
        );
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [
      normalizedCourseId,
      userId,
    ]
  );

  useEffect(() => {
    mountedRef.current = true;
    loadAssessment();

    return () => {
      mountedRef.current = false;

      if (timerRef.current) {
        window.clearTimeout(
          timerRef.current
        );
      }
    };
  }, [loadAssessment]);

  function handleAnswer(option) {
    if (
      submitted ||
      submitting
    ) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentIndex]: option,
    }));
  }

  function handleFlag() {
    if (
      submitted ||
      submitting
    ) {
      return;
    }

    setFlagged((previous) => ({
      ...previous,
      [currentIndex]:
        !previous[currentIndex],
    }));
  }

  const handleSubmit = useCallback(
    async () => {
      if (
        submittingRef.current ||
        submitted
      ) {
        return;
      }

      if (
        !assessment ||
        !enrollment
      ) {
        setError(
          'The assessment or enrollment information is unavailable.'
        );
        return;
      }

      if (
        !Array.isArray(questions) ||
        questions.length === 0
      ) {
        setError(
          'This assessment does not contain any questions.'
        );
        return;
      }

      const assessmentId = Number(
        assessment.assessment_id ??
          assessment.id
      );

      if (
        !Number.isInteger(assessmentId) ||
        assessmentId <= 0
      ) {
        setError(
          'Invalid assessment information.'
        );
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);
      setError('');

      if (timerRef.current) {
        window.clearTimeout(
          timerRef.current
        );
      }

      try {
        const submittedAnswers =
          questions.map(
            (question, index) => ({
              question_id: Number(
                question.question_id ??
                  question.id
              ),
              answer_text:
                answers[index] ?? '',
            })
          );

        const response =
          await requestWithTimeout(
            submitAssessmentResult(
              assessmentId,
              submittedAnswers
            ),
            'Submitting the assessment took too long. Please try again.'
          );

        if (!mountedRef.current) {
          return;
        }

        const numericScore = Number(
          response?.score ??
            response?.result?.score ??
            0
        );

        const passed =
          typeof response?.passed ===
          'boolean'
            ? response.passed
            : numericScore >=
              Number(
                assessment.passing_score
              );

        setResult({
          ...response,
          score: Number.isFinite(
            numericScore
          )
            ? Math.round(
                numericScore * 100
              ) / 100
            : 0,
          passed,
        });

        setSubmitted(true);

        if (passed) {
          const enrollmentId = Number(
            enrollment.enrollment_id ??
              enrollment.id
          );

          if (
            Number.isInteger(
              enrollmentId
            ) &&
            enrollmentId > 0
          ) {
            try {
              await requestWithTimeout(
                updateEnrollmentProgress(
                  enrollmentId,
                  100
                ),
                'Updating course progress took too long.'
              );
            } catch (
              progressError
            ) {
              console.error(
                'Failed to update course progress:',
                progressError
              );
            }
          }

          try {
            await requestWithTimeout(
              generateCertificate(
                normalizedCourseId
              ),
              'Generating the certificate took too long.'
            );
          } catch (
            certificateError
          ) {
            console.error(
              'Failed to generate certificate:',
              certificateError
            );
          }
        }
      } catch (submitError) {
        if (!mountedRef.current) {
          return;
        }

        setError(
          getErrorMessage(
            submitError,
            'Failed to submit the assessment.'
          )
        );
      } finally {
        submittingRef.current = false;

        if (mountedRef.current) {
          setSubmitting(false);
        }
      }
    },
    [
      answers,
      assessment,
      enrollment,
      normalizedCourseId,
      questions,
      submitted,
    ]
  );

  useEffect(() => {
    if (
      timeLeft === null ||
      submitted ||
      submitting ||
      loading
    ) {
      return undefined;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return undefined;
    }

    timerRef.current =
      window.setTimeout(() => {
        setTimeLeft(
          (previousTime) =>
            Math.max(
              previousTime - 1,
              0
            )
        );
      }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(
          timerRef.current
        );
      }
    };
  }, [
    handleSubmit,
    loading,
    submitted,
    submitting,
    timeLeft,
  ]);

  if (loading) {
    return <AssessmentSkeleton />;
  }

  if (error && !assessment) {
    return (
      <MessageState
        title="Unable to Load Assessment"
        message={error}
        actionLabel="Try Again"
        onAction={loadAssessment}
      />
    );
  }

  if (accessDenied) {
    return (
      <MessageState
        title="Assessment Access Denied"
        message="You must be enrolled in this course before you can access its assessment."
        actionLabel="Back to My Courses"
        onAction={() =>
          navigate(
            '/employee/courses'
          )
        }
      />
    );
  }

  if (!assessment) {
    return (
      <MessageState
        title="Assessment Not Available"
        message="No assessment is currently available for this course."
        actionLabel="Back to Course"
        onAction={() =>
          navigate(
            `/employee/courses/${normalizedCourseId}`
          )
        }
      />
    );
  }

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return (
      <MessageState
        title="No Assessment Questions"
        message="This assessment does not contain any questions yet."
        actionLabel="Back to Course"
        onAction={() =>
          navigate(
            `/employee/courses/${normalizedCourseId}`
          )
        }
      />
    );
  }

  if (submitted && result) {
    const score = Number(
      result.score || 0
    );

    const passed =
      Boolean(result.passed);

    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-6 ${
            passed
              ? 'bg-green-500'
              : 'bg-red-400'
          }`}
        >
          {score}%
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {passed
            ? 'Assessment Passed'
            : 'Assessment Completed'}
        </h2>

        <p className="text-gray-500 mt-2">
          {passed
            ? `You passed the assessment with a score of ${score}%.`
            : `You scored ${score}%. The passing score is ${assessment.passing_score}%.`}
        </p>

        <div className="flex gap-3 justify-center mt-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/employee/courses/${normalizedCourseId}`
              )
            }
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions =
    questions.length;

  const safeCurrentIndex =
    Math.min(
      Math.max(
        currentIndex,
        0
      ),
      totalQuestions - 1
    );

  const currentQuestion =
    questions[safeCurrentIndex];

  const questionOptions =
    Array.isArray(
      currentQuestion?.options
    )
      ? currentQuestion.options
      : [];

  const progressPercentage =
    totalQuestions > 0
      ? ((safeCurrentIndex + 1) /
          totalQuestions) *
        100
      : 0;

  const isTimeLow =
    Number(timeLeft) <= 120;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              '/employee/courses'
            )
          }
          className="hover:text-brand-600 transition"
        >
          Courses
        </button>

        <ChevronRight size={13} />

        <button
          type="button"
          onClick={() =>
            navigate(
              `/employee/courses/${normalizedCourseId}`
            )
          }
          className="hover:text-brand-600 transition truncate max-w-[160px]"
        >
          {course?.course_title ||
            'Course'}
        </button>

        <ChevronRight size={13} />

        <span className="text-brand-600 font-semibold truncate">
          {assessment.title ||
            'Assessment'}
        </span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {assessment.title ||
              'Course Assessment'}
          </h1>

          {assessment.subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">
              {assessment.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${
              isTimeLow
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}
          >
            <Clock size={15} />
            <span>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <Send size={14} />

            {submitting
              ? 'Submitting...'
              : 'Submit Assessment'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold">
            Question{' '}
            {safeCurrentIndex + 1}{' '}
            of {totalQuestions}
          </span>

          <span>
            {Math.round(
              progressPercentage
            )}
            % Complete
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-brand-600 rounded-full transition-all"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <p className="text-base font-semibold text-gray-900 mb-5 leading-relaxed">
          {currentQuestion?.question_text ||
            'Question text is unavailable.'}
        </p>

        {questionOptions.length > 0 ? (
          <div className="space-y-3">
            {questionOptions.map(
              (option, optionIndex) => {
                const isSelected =
                  answers[
                    safeCurrentIndex
                  ] === option;

                return (
                  <button
                    key={`${safeCurrentIndex}-${optionIndex}`}
                    type="button"
                    onClick={() =>
                      handleAnswer(
                        option
                      )
                    }
                    disabled={submitting}
                    className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700'
                    } disabled:cursor-not-allowed`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    <span className="text-sm">
                      {option}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No answer options are available for this question.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() =>
            setCurrentIndex(
              (index) =>
                Math.max(
                  0,
                  index - 1
                )
            )
          }
          disabled={
            safeCurrentIndex === 0 ||
            submitting
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {questions.map(
            (question, index) => (
              <button
                key={
                  question.question_id ??
                  question.id ??
                  index
                }
                type="button"
                onClick={() =>
                  setCurrentIndex(
                    index
                  )
                }
                disabled={submitting}
                className={`rounded-full transition-all ${
                  index ===
                  safeCurrentIndex
                    ? 'w-5 h-2.5 bg-brand-600'
                    : answers[index] !==
                        undefined
                      ? 'w-2.5 h-2.5 bg-brand-300'
                      : flagged[index]
                        ? 'w-2.5 h-2.5 bg-amber-400'
                        : 'w-2.5 h-2.5 bg-gray-200'
                }`}
                title={`Question ${
                  index + 1
                }`}
              />
            )
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setCurrentIndex(
              (index) =>
                Math.min(
                  totalQuestions - 1,
                  index + 1
                )
            )
          }
          disabled={
            safeCurrentIndex ===
              totalQuestions - 1 ||
            submitting
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
            <HelpCircle size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Need help?
            </p>

            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Review the course materials before submitting the assessment.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Flag size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Flag for Review
            </p>

            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Flag a question so you can return to it before submitting.
            </p>

            <button
              type="button"
              onClick={handleFlag}
              disabled={submitting}
              className={`text-xs font-bold mt-2 transition ${
                flagged[
                  safeCurrentIndex
                ]
                  ? 'text-amber-600'
                  : 'text-brand-600 hover:text-brand-700'
              } disabled:opacity-50`}
            >
              {flagged[
                safeCurrentIndex
              ]
                ? 'FLAGGED'
                : 'FLAG THIS QUESTION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}