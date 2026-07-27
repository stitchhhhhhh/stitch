import { useCallback, useEffect, useMemo, useState } from "react";

import CourseStatCard from "../../components/trainer/my-courses/CourseStatCard";
import FilterBar from "../../components/trainer/my-courses/FilterBar";
import CourseCard from "../../components/trainer/my-courses/CourseCard";
import QuickActions from "../../components/trainer/my-courses/QuickActions";
import RecentActivities from "../../components/trainer/my-courses/RecentActivities";
import CreateCourseModal from "../../components/trainer/dashboard/CreateCourseModal";
import {
  getTrainerCourses,
  submitCourseForReview,
  updateTrainerCourse,
} from "../../services/trainerService";

const STATUS_META = {
  draft: {
    label: "Draft",
    badgeColor: "bg-blue-100 text-blue-700",
    progress: 25,
    primaryButton: "Edit Course",
    group: "draft",
  },
  revision: {
    label: "Revision Required",
    badgeColor: "bg-red-100 text-red-700",
    progress: 50,
    primaryButton: "Revise Course",
    group: "development",
  },
  rejected: {
    label: "Revision Required",
    badgeColor: "bg-red-100 text-red-700",
    progress: 50,
    primaryButton: "Revise Course",
    group: "development",
  },
  submitted: {
    label: "Pending Review",
    badgeColor: "bg-yellow-100 text-yellow-700",
    progress: 75,
    primaryButton: "View Submission",
    group: "submitted",
  },
  approved: {
    label: "Published",
    badgeColor: "bg-green-100 text-green-700",
    progress: 100,
    primaryButton: "View Course",
    group: "approved",
  },
};

function MyCoursesSkeleton() {
  return (
    <div
      className="space-y-8 animate-pulse"
      aria-label="Loading trainer courses"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-10 w-64 rounded-xl bg-gray-200" />
          <div className="h-5 w-96 max-w-full rounded-lg bg-gray-200" />
        </div>

        <div className="h-12 w-52 rounded-xl bg-gray-200" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-3xl bg-gray-200"
          />
        ))}
      </div>

      <div className="h-16 rounded-2xl bg-gray-200" />

      <div className="grid gap-8 xl:grid-cols-4">
        <div className="grid gap-6 md:grid-cols-2 xl:col-span-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[430px] rounded-3xl bg-gray-200"
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="h-64 rounded-3xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function formatRelativeDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeCourse(course) {
  const rawStatus = String(course.approval_status || "draft").toLowerCase();
  const statusMeta = STATUS_META[rawStatus] || STATUS_META.draft;
  const programType = String(course.program?.program_type || "").toUpperCase();

  return {
  id: course.id,
  title: course.course_title || "Untitled Course",
  description: course.description || "",
  deadline: course.deadline || "",
  approvalStatus: rawStatus,
  image: "/icon.jpeg",
    trainingType:
      programType === "DEPARTMENT"
        ? "Department Training"
        : "General Training",
    programType,
    department: course.program?.department?.name || course.program?.program_name || "No department",
    status: statusMeta.label,
    statusGroup: statusMeta.group,
    badgeColor: statusMeta.badgeColor,
    progress: statusMeta.progress,
    updated: `Created ${formatRelativeDate(course.created_date)}`,
    secondaryButton: "Details",
    primaryButton: statusMeta.primaryButton,
    materialCount: Array.isArray(course.materials) ? course.materials.length : 0,
    assessmentCount: Array.isArray(course.assessments) ? course.assessments.length : 0,
  };
}

export default function MyCourses() {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] =
  useState(null);

const [showEditCourse, setShowEditCourse] =
  useState(false);

const [savingCourse, setSavingCourse] =
  useState(false);
  const [courses, setCourses] = useState([]);
  const [trainingType, setTrainingType] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submittingCourseId, setSubmittingCourseId] =
    useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTrainerCourses();
      setCourses(data.map(normalizeCourse));
    } catch (err) {
      setCourses([]);
      setError(err.message || "Failed to retrieve trainer courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const stats = useMemo(
    () => [
      {
        title: "Draft Courses",
        value: courses.filter((course) => course.statusGroup === "draft").length,
        color: "text-[#3046D3]",
        icon: "📝",
      },
      {
        title: "In Development",
        value: courses.filter((course) => course.statusGroup === "development").length,
        color: "text-orange-500",
        icon: "⚙️",
      },
      {
        title: "Pending Review",
        value: courses.filter((course) => course.statusGroup === "submitted").length,
        color: "text-yellow-500",
        icon: "📋",
      },
      {
        title: "Published Courses",
        value: courses.filter((course) => course.statusGroup === "approved").length,
        color: "text-green-600",
        icon: "✅",
      },
    ],
    [courses]
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const typeMatches =
          trainingType === "all" || course.programType === trainingType;
        const statusMatches =
          status === "all" || course.statusGroup === status;

        return typeMatches && statusMatches;
      }),
    [courses, status, trainingType]
  );

  const editableCourses = useMemo(
  () =>
    courses.filter((course) =>
      [
        "draft",
        "revision",
        "rejected",
      ].includes(course.approvalStatus)
    ),
  [courses]
);

const latestEditableCourse =
  editableCourses[0] || null;

const latestCourse = courses[0] || null;

  const recentActivities = useMemo(
    () =>
      courses.slice(0, 5).map((course) => ({
        id: course.id,
        title: `${course.title} — ${course.status}`,
        time: course.updated,
      })),
    [courses]
  );

  async function handleCreated() {
    setShowCreateCourse(false);
    await loadCourses();
  }

  function handleEditCourse(course) {
  if (
    ![
      "draft",
      "revision",
      "rejected",
    ].includes(course.approvalStatus)
  ) {
    setError(
      `A course with status ${course.approvalStatus} cannot be edited.`
    );
    return;
  }

  setError("");
  setNotice("");
  setSelectedCourse(course);
  setShowEditCourse(true);
}

async function handleUpdateCourse(payload) {
  if (!selectedCourse) {
    return;
  }

  setSavingCourse(true);
  setError("");
  setNotice("");

  try {
    await updateTrainerCourse(
      selectedCourse.id,
      payload
    );

    setNotice(
      `"${payload.course_title}" was updated successfully.`
    );

    setShowEditCourse(false);
    setSelectedCourse(null);

    await loadCourses();
  } catch (err) {
    setError(
      err.message ||
        "Failed to update the course."
    );
  } finally {
    setSavingCourse(false);
  }
}

function handleViewCourse(course) {
  setSelectedCourse(course);
  setError("");

  setNotice(
    `Course: ${course.title} | Status: ${course.status} | Type: ${course.trainingType} | Department: ${course.department}`
  );
}

  function clearFilters() {
    setTrainingType("all");
    setStatus("all");
  }

  async function handleSubmitCourse(course) {
    const confirmed = window.confirm(
      `Submit "${course.title}" for HR review?`
    );

    if (!confirmed) {
      return;
    }

    setSubmittingCourseId(course.id);
    setError("");
    setNotice("");

    try {
      await submitCourseForReview(course.id);

      setNotice(
        `"${course.title}" was submitted successfully and is now pending review.`
      );

      await loadCourses();
    } catch (err) {
      setError(
        err.message ||
          "Failed to submit the course for review."
      );
    } finally {
      setSubmittingCourseId(null);
    }
  }

  function handleUploadMaterial() {
  if (!latestEditableCourse) {
    setError(
      "There is no editable course available for material upload."
    );
    setNotice("");
    return;
  }

  setError("");
  setSelectedCourse(latestEditableCourse);

  setNotice(
    `Selected "${latestEditableCourse.title}". Materials can be uploaded while this course is editable.`
  );
}

  if (loading) {
    return <MyCoursesSkeleton />;
  }

  function handleQuickEdit() {
  if (!latestEditableCourse) {
    setError(
      "There is no draft or revision course available to edit."
    );
    setNotice("");
    return;
  }

  handleEditCourse(latestEditableCourse);
}

function handleQuickView() {
  if (!latestCourse) {
    setError(
      "There is no course available to view."
    );
    setNotice("");
    return;
  }

  handleViewCourse(latestCourse);
}

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">My Courses</h1>
          <p className="text-gray-500 mt-2">
            Manage assigned training courses and development progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateCourse(true)}
          className="bg-[#3046D3] text-white px-6 py-3 rounded-xl hover:bg-[#253B80] transition"
        >
          + Create New Course
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <CourseStatCard key={item.title} {...item} />
        ))}
      </div>

      <FilterBar
        trainingType={trainingType}
        status={status}
        onTrainingTypeChange={setTrainingType}
        onStatusChange={setStatus}
        onClear={clearFilters}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-4">
        <div className="xl:col-span-3">
          {filteredCourses.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#253B80]">No courses found</h2>
              <p className="mt-2 text-gray-500">
                Courses created or assigned to you will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <CourseCard
  key={course.id}
  course={course}
  onEdit={handleEditCourse}
  onView={handleViewCourse}
  onSubmit={handleSubmitCourse}
  submitting={
    submittingCourseId === course.id
  }
/>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
                    <QuickActions
  onEdit={handleQuickEdit}
  onUpload={handleUploadMaterial}
  onView={handleQuickView}
  disableEdit={!latestEditableCourse}
  disableView={!latestCourse}
/>
          <RecentActivities activities={recentActivities} />
        </div>
      </div>

      {showCreateCourse && (
  <CreateCourseModal
    onClose={() => setShowCreateCourse(false)}
    onCreated={handleCreated}
  />
)}

{showEditCourse && selectedCourse && (
  <EditCourseModal
    course={selectedCourse}
    saving={savingCourse}
    onClose={() => {
      if (!savingCourse) {
        setShowEditCourse(false);
        setSelectedCourse(null);
      }
    }}
    onSave={handleUpdateCourse}
  />
)}
    </div>
  );
}
