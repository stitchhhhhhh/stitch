import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAssessmentByCourseId,
  getCourseById,
  getMyCourses,
  updateEnrollmentProgress,
} from '../../services/courseService';

import {
  generateCertificate,
} from '../../services/userService';
import { Clock, ChevronLeft, ChevronRight, Flag, HelpCircle, Send } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AssessmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user_id ?? 1;

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [course, setCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    async function load() {
      const [assessmentData, courseData] = await Promise.all([
  getAssessmentByCourseId(courseId),
  getCourseById(courseId),
]);

if (!assessmentData) return;

setAssessment(assessmentData);
setCourse(courseData);
setQuestions(assessmentData.questions || []);
setTimeLeft((assessmentData.duration_minutes || 30) * 60);
      setLoading(false);
    }
    load();
  }, [courseId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted]);

  function handleAnswer(option) {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  }

  function handleFlag() {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  }

  async function handleSubmit() {
    clearTimeout(timerRef.current);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    const passed = finalScore >= assessment.passing_score;

    // Kalau lulus → update progress ke 100% di localStorage
    // Nanti tinggal ganti updateCourseProgress jadi axios call ke backend
    if (passed) {

  const myCourses =
    await getMyCourses(userId);

  const enrollment =
    myCourses.find(
      c => c.course_id === Number(courseId)
    )?.enrollment;

  if (enrollment) {

    await updateEnrollmentProgress(
      enrollment.enrollment_id,
      100
    );

    try {
      await generateCertificate(
        Number(courseId)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

    setScore(finalScore);
    setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading assessment...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Assessment not found.
      </div>
    );
  }

  // ===== RESULT SCREEN =====
  if (submitted) {
    const passed = score >= assessment.passing_score;
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-6 ${
            passed ? 'bg-green-500' : 'bg-red-400'
          }`}
        >
          {score}%
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {passed ? '🎉 Congratulations!' : 'Keep Practicing'}
        </h2>
        <p className="text-gray-500 mt-2">
          {passed
            ? `You passed the assessment with a score of ${score}%.`
            : `You scored ${score}%. Passing score is ${assessment.passing_score}%.`}
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={() => navigate(`/employee/courses/${courseId}`)}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Back to Course
          </button>
          {!passed && (
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setFlagged({});
                setCurrentIndex(0);
                setTimeLeft(assessment.duration_minutes * 60);
                setScore(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPct = ((currentIndex + 1) / totalQuestions) * 100;
  const isTimeLow = timeLeft <= 120;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <button
          onClick={() => navigate('/employee/courses')}
          className="hover:text-brand-600 transition"
        >
          Courses
        </button>
        <ChevronRight size={13} />
        <button
          onClick={() => navigate(`/employee/courses/${courseId}`)}
          className="hover:text-brand-600 transition truncate max-w-[160px]"
        >
          {course?.course_title}
        </button>
        <ChevronRight size={13} />
        <span className="text-brand-600 font-semibold truncate">
          {assessment.title.split('-').pop().trim()}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{assessment.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{assessment.subtitle}</p>
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
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition"
          >
            <Send size={14} />
            Submit Assessment
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progressPct)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-brand-600 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <p className="text-base font-semibold text-gray-900 mb-5 leading-relaxed">
          {currentQuestion?.question_text}
        </p>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = answers[currentIndex] === option;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswer(option)}
                className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-brand-600 bg-brand-600' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-5 h-2.5 bg-brand-600'
                  : answers[idx]
                  ? 'w-2.5 h-2.5 bg-brand-300'
                  : flagged[idx]
                  ? 'w-2.5 h-2.5 bg-amber-400'
                  : 'w-2.5 h-2.5 bg-gray-200'
              }`}
              title={`Question ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
          disabled={currentIndex === totalQuestions - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Footer helper cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
            <HelpCircle size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Need help?</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Review the "Risk Management Framework" reading material in Module 1
              before continuing if you are unsure.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Flag size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Flag for Review</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Not sure about this one? Flag it to return later.
            </p>
            <button
              onClick={handleFlag}
              className={`text-xs font-bold mt-2 transition ${
                flagged[currentIndex]
                  ? 'text-amber-600'
                  : 'text-brand-600 hover:text-brand-700'
              }`}
            >
              {flagged[currentIndex] ? '🚩 Flagged' : 'FLAG THIS QUESTION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
