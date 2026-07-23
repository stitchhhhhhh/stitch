import { useCallback, useEffect, useMemo, useState } from "react";

import CourseStatCard from "../../components/trainer/my-courses/CourseStatCard";
import FilterBar from "../../components/trainer/my-courses/FilterBar";
import CourseCard from "../../components/trainer/my-courses/CourseCard";
import QuickActions from "../../components/trainer/my-courses/QuickActions";
import RecentActivities from "../../components/trainer/my-courses/RecentActivities";
import CreateCourseModal from "../../components/trainer/dashboard/CreateCourseModal";
import { getTrainerCourses } from "../../services/trainerService";

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
  const [courses, setCourses] = useState([]);
  const [trainingType, setTrainingType] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  function clearFilters() {
    setTrainingType("all");
    setStatus("all");
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

      <div className="grid gap-8 xl:grid-cols-4">
        <div className="xl:col-span-3">
          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#253B80]">No courses found</h2>
              <p className="mt-2 text-gray-500">
                Courses created or assigned to you will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <QuickActions
            onUpload={() =>
              alert("Open a course first to upload learning material.")
            }
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
    </div>
  );
}
