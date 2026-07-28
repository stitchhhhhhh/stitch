import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import UploadMaterialModal from "../../components/trainer/dashboard/UploadMaterialModal";
import EditCourseModal from "../../components/trainer/my-courses/EditCourseModal";

import {
  createAssessmentQuestion,
  createTrainerAssessment,
  deleteAssessmentQuestion,
  deleteMaterial,
  getTrainerCourseAssessments,
  getTrainerCourseDetail,
  submitCourseForReview,
  updateAssessmentQuestion,
  updateTrainerCourse,
} from "../../services/trainerService";

const EDITABLE_STATUSES = [
  "draft",
  "revision",
  "rejected",
];

const OPTION_LABELS = [
  "A",
  "B",
  "C",
  "D",
];

const EMPTY_OPTIONS = [
  "",
  "",
  "",
  "",
];

const STATUS_META = {
  draft: {
    label: "Draft",
    className:
      "bg-blue-100 text-blue-700",
  },
  revision: {
    label: "Revision Required",
    className:
      "bg-red-100 text-red-700",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-700",
  },
  submitted: {
    label: "Pending Review",
    className:
      "bg-yellow-100 text-yellow-700",
  },
  approved: {
    label: "Published",
    className:
      "bg-green-100 text-green-700",
  },
};

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CourseDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-72 rounded-xl bg-gray-200" />
      <div className="h-48 rounded-3xl bg-gray-200" />
      <div className="h-64 rounded-3xl bg-gray-200" />
      <div className="h-72 rounded-3xl bg-gray-200" />
    </div>
  );
}

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
      <h3 className="font-semibold text-gray-700">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function TrainerCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [course, setCourse] =
    useState(null);
  const [assessments, setAssessments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [notice, setNotice] =
    useState("");

  const [activeSection, setActiveSection] =
    useState(
      searchParams.get("section") ||
        "overview"
    );

  const [
    showUploadMaterial,
    setShowUploadMaterial,
  ] = useState(false);

  const [
    showEditCourse,
    setShowEditCourse,
  ] = useState(false);

  const [
    savingCourse,
    setSavingCourse,
  ] = useState(false);

  const [
    submittingCourse,
    setSubmittingCourse,
  ] = useState(false);

  const [
    deletingMaterialId,
    setDeletingMaterialId,
  ] = useState(null);

  const [
    assessmentTitle,
    setAssessmentTitle,
  ] = useState("");

  const [
    passingScore,
    setPassingScore,
  ] = useState("70");

  const [
    creatingAssessment,
    setCreatingAssessment,
  ] = useState(false);

  const [
    selectedAssessmentId,
    setSelectedAssessmentId,
  ] = useState(null);

  const [
    questionText,
    setQuestionText,
  ] = useState("");

  const [
    answerOptions,
    setAnswerOptions,
  ] = useState(EMPTY_OPTIONS);

  const [
    correctAnswer,
    setCorrectAnswer,
  ] = useState("");

  const [
    editingQuestion,
    setEditingQuestion,
  ] = useState(null);

  const [
    savingQuestion,
    setSavingQuestion,
  ] = useState(false);

  const [
    deletingQuestionId,
    setDeletingQuestionId,
  ] = useState(null);

  const loadCourse = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      try {
        const [
          courseData,
          assessmentData,
        ] = await Promise.all([
          getTrainerCourseDetail(courseId),
          getTrainerCourseAssessments(
            courseId
          ),
        ]);

        setCourse(courseData);
        setAssessments(assessmentData);
      } catch (loadError) {
        setCourse(null);
        setAssessments([]);

        setError(
          loadError?.message ||
            "Failed to load the course."
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [courseId]
  );

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const approvalStatus = String(
    course?.approval_status || "draft"
  ).toLowerCase();

  const statusMeta =
    STATUS_META[approvalStatus] ||
    STATUS_META.draft;

  const isEditable =
    EDITABLE_STATUSES.includes(
      approvalStatus
    );

  const materials = Array.isArray(
    course?.materials
  )
    ? course.materials
    : [];

  const totalQuestions = useMemo(
    () =>
      assessments.reduce(
        (total, assessment) =>
          total +
          (Array.isArray(
            assessment.questions
          )
            ? assessment.questions.length
            : 0),
        0
      ),
    [assessments]
  );

  /*
   * Course setup progress:
   * 20% title
   * 20% description
   * 20% material
   * 20% assessment
   * 20% question
   *
   * This is content-completeness progress,
   * not employee learning progress.
   */
  const setupProgress = useMemo(() => {
    const completedChecks = [
      Boolean(course?.course_title?.trim()),
      Boolean(course?.description?.trim()),
      materials.length > 0,
      assessments.length > 0,
      totalQuestions > 0,
    ].filter(Boolean).length;

    return completedChecks * 20;
  }, [
    assessments.length,
    course?.course_title,
    course?.description,
    materials.length,
    totalQuestions,
  ]);

  const selectedAssessment =
    assessments.find(
      (assessment) =>
        assessment.id ===
        selectedAssessmentId
    ) || null;

  function changeSection(section) {
    setActiveSection(section);

    if (section === "overview") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      section,
    });
  }

  function clearMessages() {
    setError("");
    setNotice("");
  }

  async function handleCourseUpdate(
    payload
  ) {
    setSavingCourse(true);
    clearMessages();

    try {
      await updateTrainerCourse(
        course.id,
        payload
      );

      setShowEditCourse(false);

      setNotice(
        "Course information updated successfully."
      );

      await loadCourse({
        showLoading: false,
      });
    } catch (updateError) {
      setError(
        updateError?.message ||
          "Failed to update the course."
      );
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleMaterialUploaded() {
    setShowUploadMaterial(false);

    setNotice(
      "Material uploaded successfully."
    );

    await loadCourse({
      showLoading: false,
    });
  }

  async function handleDeleteMaterial(
    material
  ) {
    const confirmed = window.confirm(
      `Delete "${material.material_title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingMaterialId(material.id);
    clearMessages();

    try {
      await deleteMaterial(material.id);

      setNotice(
        "Material deleted successfully."
      );

      await loadCourse({
        showLoading: false,
      });
    } catch (deleteError) {
      setError(
        deleteError?.message ||
          "Failed to delete the material."
      );
    } finally {
      setDeletingMaterialId(null);
    }
  }

  async function handleCreateAssessment(
    event
  ) {
    event.preventDefault();

    const normalizedTitle =
      assessmentTitle.trim();

    const normalizedScore =
      Number(passingScore);

    if (!normalizedTitle) {
      setError(
        "Assessment title is required."
      );
      return;
    }

    if (
      !Number.isInteger(normalizedScore) ||
      normalizedScore < 0 ||
      normalizedScore > 100
    ) {
      setError(
        "Passing score must be an integer between 0 and 100."
      );
      return;
    }

    setCreatingAssessment(true);
    clearMessages();

    try {
      const assessment =
        await createTrainerAssessment({
          course_id: course.id,
          title: normalizedTitle,
          passing_score:
            normalizedScore,
        });

      setAssessmentTitle("");
      setPassingScore("70");

      setNotice(
        "Assessment created successfully."
      );

      await loadCourse({
        showLoading: false,
      });

      setSelectedAssessmentId(
        assessment.id
      );
    } catch (createError) {
      setError(
        createError?.message ||
          "Failed to create the assessment."
      );
    } finally {
      setCreatingAssessment(false);
    }
  }

  function startCreateQuestion(
    assessment
  ) {
    clearMessages();

    setSelectedAssessmentId(
      assessment.id
    );

    setEditingQuestion(null);
    setQuestionText("");
    setAnswerOptions([...EMPTY_OPTIONS]);
    setCorrectAnswer("");
  }

  function startEditQuestion(
    assessment,
    question
  ) {
    clearMessages();

    setSelectedAssessmentId(
      assessment.id
    );

    setEditingQuestion(question);

    setQuestionText(
      question.question_text || ""
    );

    const existingOptions = Array.isArray(
      question.options
    )
      ? [...question.options].sort(
          (first, second) =>
            Number(first.position || 0) -
            Number(second.position || 0)
        )
      : [];

    const normalizedOptions =
      OPTION_LABELS.map(
        (_, index) =>
          existingOptions[index]
            ?.option_text ||
          existingOptions[index]?.text ||
          ""
      );

    setAnswerOptions(normalizedOptions);

    const correctOption =
      existingOptions.find(
        (option) =>
          option.is_correct === true
      );

    const correctPosition =
      Number(
        question.correct_option ||
          correctOption?.position
      );

    if (
      Number.isInteger(correctPosition) &&
      correctPosition >= 1 &&
      correctPosition <= 4
    ) {
      setCorrectAnswer(
        OPTION_LABELS[
          correctPosition - 1
        ]
      );
      return;
    }

    const correctText = String(
      question.correct_answer || ""
    ).trim();

    const matchingIndex =
      normalizedOptions.findIndex(
        (option) =>
          option.trim().toLowerCase() ===
          correctText.toLowerCase()
      );

    setCorrectAnswer(
      matchingIndex >= 0
        ? OPTION_LABELS[matchingIndex]
        : ""
    );
  }

  function resetQuestionForm() {
    setEditingQuestion(null);
    setQuestionText("");
    setAnswerOptions([...EMPTY_OPTIONS]);
    setCorrectAnswer("");
  }

  function updateAnswerOption(
    index,
    value
  ) {
    setAnswerOptions(
      (currentOptions) =>
        currentOptions.map(
          (option, optionIndex) =>
            optionIndex === index
              ? value
              : option
        )
    );
  }

  async function handleSaveQuestion(
    event
  ) {
    event.preventDefault();

    if (!selectedAssessmentId) {
      setError(
        "Please select an assessment."
      );
      return;
    }

    const normalizedQuestion =
      questionText.trim();

    const normalizedOptions =
      answerOptions.map((option) =>
        option.trim()
      );

    const normalizedAnswer =
      correctAnswer.trim().toUpperCase();

    if (!normalizedQuestion) {
      setError(
        "Question text is required."
      );
      return;
    }

    if (
      normalizedOptions.some(
        (option) => !option
      )
    ) {
      setError(
        "All four answer options are required."
      );
      return;
    }

    const uniqueOptions = new Set(
      normalizedOptions.map((option) =>
        option.toLowerCase()
      )
    );

    if (uniqueOptions.size !== 4) {
      setError(
        "All answer options must be different."
      );
      return;
    }

    if (
      !OPTION_LABELS.includes(
        normalizedAnswer
      )
    ) {
      setError(
        "Please select the correct answer."
      );
      return;
    }

    setSavingQuestion(true);
    clearMessages();

    try {
      const payload = {
        question_text:
          normalizedQuestion,
        options:
          normalizedOptions,
        correct_answer:
          normalizedAnswer,
      };

      if (editingQuestion) {
        await updateAssessmentQuestion(
          editingQuestion.id,
          payload
        );

        setNotice(
          "Question updated successfully."
        );
      } else {
        await createAssessmentQuestion(
          selectedAssessmentId,
          payload
        );

        setNotice(
          "Question created successfully."
        );
      }

      resetQuestionForm();

      await loadCourse({
        showLoading: false,
      });
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Failed to save the question."
      );
    } finally {
      setSavingQuestion(false);
    }
  }

  async function handleDeleteQuestion(
    question
  ) {
    const confirmed = window.confirm(
      "Delete this assessment question?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingQuestionId(question.id);
    clearMessages();

    try {
      await deleteAssessmentQuestion(
        question.id
      );

      setNotice(
        "Question deleted successfully."
      );

      if (
        editingQuestion?.id ===
        question.id
      ) {
        resetQuestionForm();
      }

      await loadCourse({
        showLoading: false,
      });
    } catch (deleteError) {
      setError(
        deleteError?.message ||
          "Failed to delete the question."
      );
    } finally {
      setDeletingQuestionId(null);
    }
  }

  async function handleSubmitCourse() {
    const confirmed = window.confirm(
      `Submit "${course.course_title}" for review?`
    );

    if (!confirmed) {
      return;
    }

    setSubmittingCourse(true);
    clearMessages();

    try {
      await submitCourseForReview(
        course.id
      );

      setNotice(
        "Course submitted successfully and is now pending review."
      );

      changeSection("submission");

      await loadCourse({
        showLoading: false,
      });
    } catch (submitError) {
      setError(
        submitError?.message ||
          "Failed to submit the course."
      );
    } finally {
      setSubmittingCourse(false);
    }
  }

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            navigate("/trainer/courses")
          }
          className="font-semibold text-[#3046D3] hover:underline"
        >
          ← Back to My Courses
        </button>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          {error ||
            "Course could not be found."}
        </div>
      </div>
    );
  }

  const sections = [
    {
      value: "overview",
      label: "Overview",
    },
    {
      value: "materials",
      label: `Materials (${materials.length})`,
    },
    {
      value: "assessments",
      label: `Assessments (${assessments.length})`,
    },
    {
      value: "submission",
      label: "Submission",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/trainer/courses")
          }
          className="font-semibold text-[#3046D3] hover:underline"
        >
          ← Back to My Courses
        </button>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-[#253B80]">
              {course.course_title}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <p className="mt-3 max-w-3xl text-gray-500">
            {course.description ||
              "No course description has been provided."}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>
              Program:{" "}
              {course.program
                ?.program_name ||
                "Not provided"}
            </span>

            <span>
              Type:{" "}
              {course.program
                ?.program_type ||
                "Not provided"}
            </span>

            <span>
              Deadline:{" "}
              {formatDate(
                course.deadline
              )}
            </span>
          </div>
        </div>

        {isEditable && (
          <button
            type="button"
            onClick={() => {
              clearMessages();
              setShowEditCourse(true);
            }}
            className="rounded-xl border border-[#3046D3] px-5 py-3 font-semibold text-[#3046D3] hover:bg-blue-50"
          >
            Edit Course
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          <span>{notice}</span>

          <button
            type="button"
            onClick={() =>
              setNotice("")
            }
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#253B80]">
              Course Setup Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Calculated from course information,
              materials, assessments, and questions.
            </p>
          </div>

          <span className="text-2xl font-bold text-[#3046D3]">
            {setupProgress}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#3046D3] transition-all"
            style={{
              width: `${setupProgress}%`,
            }}
          />
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
          <span>
            {course.course_title
              ? "✓"
              : "○"}{" "}
            Title
          </span>

          <span>
            {course.description
              ? "✓"
              : "○"}{" "}
            Description
          </span>

          <span>
            {materials.length > 0
              ? "✓"
              : "○"}{" "}
            Material
          </span>

          <span>
            {assessments.length > 0
              ? "✓"
              : "○"}{" "}
            Assessment
          </span>

          <span>
            {totalQuestions > 0
              ? "✓"
              : "○"}{" "}
            Question
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.value}
            type="button"
            onClick={() =>
              changeSection(
                section.value
              )
            }
            className={`border-b-2 px-4 py-3 font-semibold transition ${
              activeSection ===
              section.value
                ? "border-[#3046D3] text-[#3046D3]"
                : "border-transparent text-gray-500 hover:text-[#3046D3]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {activeSection ===
        "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-[#253B80]">
              Course Information
            </h2>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">
                  Course title
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {course.course_title}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Approval status
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {statusMeta.label}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Program
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {course.program
                    ?.program_name ||
                    "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Program type
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {course.program
                    ?.program_type ||
                    "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Created
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {formatDate(
                    course.created_date
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Deadline
                </dt>

                <dd className="mt-1 font-semibold text-gray-800">
                  {formatDate(
                    course.deadline
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#253B80]">
              Content Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Materials
                </span>

                <strong>
                  {materials.length}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Assessments
                </span>

                <strong>
                  {assessments.length}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Questions
                </span>

                <strong>
                  {totalQuestions}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection ===
        "materials" && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#253B80]">
                Learning Materials
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload and manage materials for
                this course.
              </p>
            </div>

            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setShowUploadMaterial(true);
                }}
                className="rounded-xl bg-[#3046D3] px-5 py-3 font-semibold text-white hover:bg-[#253B80]"
              >
                + Upload Material
              </button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {materials.length === 0 ? (
              <EmptyState
                title="No materials uploaded"
                description="Uploaded course materials will appear here."
              />
            ) : (
              materials.map(
                (material) => (
                  <div
                    key={material.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {material.material_title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {material.material_type ||
                          "Material"}{" "}
                        · Uploaded{" "}
                        {formatDate(
                          material.uploaded_date
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {material.file_url && (
                        <a
                          href={
                            material.file_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-[#3046D3] px-4 py-2 font-semibold text-[#3046D3] hover:bg-blue-50"
                        >
                          View
                        </a>
                      )}

                      {isEditable && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMaterial(
                              material
                            )
                          }
                          disabled={
                            deletingMaterialId ===
                            material.id
                          }
                          className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingMaterialId ===
                          material.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}

      {activeSection ===
        "assessments" && (
        <div className="space-y-6">
          {isEditable && (
            <form
              onSubmit={
                handleCreateAssessment
              }
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-[#253B80]">
                Create Assessment
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_auto]">
                <input
                  type="text"
                  value={
                    assessmentTitle
                  }
                  onChange={(event) =>
                    setAssessmentTitle(
                      event.target.value
                    )
                  }
                  placeholder="Assessment title"
                  disabled={
                    creatingAssessment
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(event) =>
                    setPassingScore(
                      event.target.value
                    )
                  }
                  disabled={
                    creatingAssessment
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
                />

                <button
                  type="submit"
                  disabled={
                    creatingAssessment
                  }
                  className="rounded-xl bg-[#3046D3] px-5 py-3 font-semibold text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingAssessment
                    ? "Creating..."
                    : "Create"}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-5">
            {assessments.length ===
            0 ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <EmptyState
                  title="No assessments"
                  description="Created assessments and questions will appear here."
                />
              </div>
            ) : (
              assessments.map(
                (assessment) => {
                  const questions =
                    Array.isArray(
                      assessment.questions
                    )
                      ? assessment.questions
                      : [];

                  return (
                    <div
                      key={assessment.id}
                      className="rounded-3xl bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h2 className="text-xl font-bold text-[#253B80]">
                            {
                              assessment.title
                            }
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            Passing score:{" "}
                            {
                              assessment.passing_score
                            }
                            % ·{" "}
                            {
                              questions.length
                            }{" "}
                            question(s)
                          </p>
                        </div>

                        {isEditable && (
                          <button
                            type="button"
                            onClick={() =>
                              startCreateQuestion(
                                assessment
                              )
                            }
                            className="rounded-xl border border-[#3046D3] px-4 py-2 font-semibold text-[#3046D3] hover:bg-blue-50"
                          >
                            + Add Question
                          </button>
                        )}
                      </div>

                      <div className="mt-5 space-y-3">
                        {questions.length ===
                        0 ? (
                          <EmptyState
                            title="No questions"
                            description="Add a question to complete this assessment."
                          />
                        ) : (
                          questions.map(
                            (
                              question,
                              index
                            ) => (
                              <div
                                key={
                                  question.id
                                }
                                className="rounded-2xl border border-gray-200 p-5"
                              >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {index +
                                        1}
                                      .{" "}
                                      {
                                        question.question_text
                                      }
                                    </p>

                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                      {(Array.isArray(
                                        question.options
                                      )
                                        ? [...question.options].sort(
                                            (
                                              first,
                                              second
                                            ) =>
                                              Number(
                                                first.position ||
                                                  0
                                              ) -
                                              Number(
                                                second.position ||
                                                  0
                                              )
                                          )
                                        : []
                                      ).map(
                                        (
                                          option,
                                          optionIndex
                                        ) => {
                                          const isCorrect =
                                            option.is_correct ===
                                              true ||
                                            String(
                                              option.option_text ||
                                                option.text ||
                                                ""
                                            )
                                              .trim()
                                              .toLowerCase() ===
                                              String(
                                                question.correct_answer ||
                                                  ""
                                              )
                                                .trim()
                                                .toLowerCase();

                                          return (
                                            <div
                                              key={
                                                option.id ||
                                                `${question.id}-${optionIndex}`
                                              }
                                              className={`rounded-xl border px-3 py-2 text-sm ${
                                                isCorrect
                                                  ? "border-green-300 bg-green-50 text-green-700"
                                                  : "border-gray-200 bg-gray-50 text-gray-600"
                                              }`}
                                            >
                                              <span className="font-semibold">
                                                {
                                                  OPTION_LABELS[
                                                    optionIndex
                                                  ]
                                                }
                                                .
                                              </span>{" "}
                                              {option.option_text ||
                                                option.text}
                                              {isCorrect && (
                                                <span className="ml-2 font-semibold">
                                                  (Correct)
                                                </span>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>

                                  {isEditable && (
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          startEditQuestion(
                                            assessment,
                                            question
                                          )
                                        }
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                      >
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteQuestion(
                                            question
                                          )
                                        }
                                        disabled={
                                          deletingQuestionId ===
                                          question.id
                                        }
                                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {deletingQuestionId ===
                                        question.id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>

                      {isEditable &&
                        selectedAssessmentId ===
                          assessment.id && (
                          <form
                            onSubmit={
                              handleSaveQuestion
                            }
                            className="mt-6 rounded-2xl bg-gray-50 p-5"
                          >
                            <h3 className="font-bold text-[#253B80]">
                              {editingQuestion
                                ? "Edit Question"
                                : "Add Question"}
                            </h3>

                            <div className="mt-4 space-y-4">
                              <textarea
                                rows={3}
                                value={
                                  questionText
                                }
                                onChange={(
                                  event
                                ) =>
                                  setQuestionText(
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="Question text"
                                disabled={
                                  savingQuestion
                                }
                                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3046D3]"
                              />

                              <div>
                                <p className="mb-3 text-sm font-semibold text-gray-700">
                                  Answer options
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                  {OPTION_LABELS.map(
                                    (
                                      label,
                                      index
                                    ) => (
                                      <label
                                        key={
                                          label
                                        }
                                        className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:border-[#3046D3]"
                                      >
                                        <span className="font-bold text-[#3046D3]">
                                          {
                                            label
                                          }
                                          .
                                        </span>

                                        <input
                                          type="text"
                                          value={
                                            answerOptions[
                                              index
                                            ]
                                          }
                                          onChange={(
                                            event
                                          ) =>
                                            updateAnswerOption(
                                              index,
                                              event
                                                .target
                                                .value
                                            )
                                          }
                                          placeholder={`Option ${label}`}
                                          disabled={
                                            savingQuestion
                                          }
                                          className="min-w-0 flex-1 bg-transparent outline-none"
                                        />
                                      </label>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="correct-answer"
                                  className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                  Correct answer
                                </label>

                                <select
                                  id="correct-answer"
                                  value={
                                    correctAnswer
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setCorrectAnswer(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  disabled={
                                    savingQuestion
                                  }
                                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#3046D3]"
                                >
                                  <option value="">
                                    Select the correct answer
                                  </option>

                                  {OPTION_LABELS.map(
                                    (
                                      label,
                                      index
                                    ) => (
                                      <option
                                        key={
                                          label
                                        }
                                        value={
                                          label
                                        }
                                      >
                                        {label}
                                        {answerOptions[
                                          index
                                        ]?.trim()
                                          ? ` — ${answerOptions[
                                              index
                                            ].trim()}`
                                          : ""}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>

                              <div className="flex justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetQuestionForm();
                                    setSelectedAssessmentId(
                                      null
                                    );
                                  }}
                                  disabled={
                                    savingQuestion
                                  }
                                  className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-white"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="submit"
                                  disabled={
                                    savingQuestion
                                  }
                                  className="rounded-xl bg-[#3046D3] px-4 py-2 font-semibold text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {savingQuestion
                                    ? "Saving..."
                                    : editingQuestion
                                      ? "Update Question"
                                      : "Add Question"}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      )}

      {activeSection ===
        "submission" && (
        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-[#253B80]">
            Course Submission
          </h2>

          <div className="mt-6 rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Current status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </span>
              </div>

              {isEditable && (
                <button
                  type="button"
                  onClick={
                    handleSubmitCourse
                  }
                  disabled={
                    submittingCourse
                  }
                  className="rounded-xl bg-[#3046D3] px-6 py-3 font-semibold text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingCourse
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Materials
                </p>

                <p className="mt-1 text-2xl font-bold text-[#253B80]">
                  {materials.length}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Assessments
                </p>

                <p className="mt-1 text-2xl font-bold text-[#253B80]">
                  {assessments.length}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Questions
                </p>

                <p className="mt-1 text-2xl font-bold text-[#253B80]">
                  {totalQuestions}
                </p>
              </div>
            </div>

            {approvalStatus ===
              "submitted" && (
              <p className="mt-6 rounded-xl bg-yellow-50 p-4 text-yellow-700">
                This course has been submitted and
                is waiting for review.
              </p>
            )}

            {approvalStatus ===
              "approved" && (
              <p className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">
                This course has been approved and
                published.
              </p>
            )}

            {approvalStatus ===
              "revision" && (
              <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
                Revision is required. Update the
                course content and submit it again.
              </p>
            )}

            {approvalStatus ===
              "rejected" && (
              <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
                This course was rejected. Update the
                course before submitting it again.
              </p>
            )}
          </div>
        </div>
      )}

      {showUploadMaterial && (
        <UploadMaterialModal
          courses={[
            {
              id: course.id,
              course_title:
                course.course_title,
            },
          ]}
          initialCourseId={course.id}
          lockCourse
          onClose={() =>
            setShowUploadMaterial(false)
          }
          onUploaded={
            handleMaterialUploaded
          }
        />
      )}

      {showEditCourse && (
        <EditCourseModal
          course={{
            id: course.id,
            title:
              course.course_title,
            description:
              course.description || "",
            deadline:
              course.deadline || "",
          }}
          saving={savingCourse}
          onClose={() => {
            if (!savingCourse) {
              setShowEditCourse(false);
            }
          }}
          onSave={handleCourseUpdate}
        />
      )}
    </div>
  );
}