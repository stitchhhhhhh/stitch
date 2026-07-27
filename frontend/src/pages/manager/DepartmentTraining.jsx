import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import KPIStatCard from "../../components/manager/departmentTraining/KPIStatCard";
import CoursePipelineCard from "../../components/manager/departmentTraining/CoursePipelineCard";
import UpcomingDeadlines from "../../components/manager/departmentTraining/UpcomingDeadlines";
import RecentActivities from "../../components/manager/departmentTraining/RecentActivities";

import {
  getManagerDepartmentTraining,
  updateManagerCourseReview,
} from "../../services/managerService";

const EMPTY_DATA = {
  stats: {
    waitingForTrainer: 0,
    inDevelopment: 0,
    pendingReview: 0,
    publishedPrograms: 0,
  },
  courses: [],
  upcomingDeadlines: [],
  recentActivities: [],
};

function createCardData(course) {
  const status = String(
    course.approval_status || course.status || ""
  ).toLowerCase();

  const baseCourse = {
    ...course,
    status,
    border:
      status === "submitted"
        ? "border-red-300"
        : status === "approved"
          ? "border-blue-300"
          : status === "rejected"
            ? "border-gray-400"
            : "border-indigo-200",
  };

  if (status === "submitted") {
    return {
      ...baseCourse,
      action1: "Approve Course",
      action2: "View Course",
      action3: "Request Revision",
    };
  }

  if (status === "approved") {
    return {
      ...baseCourse,
      action1: "View Analytics",
      action2: "Manage Enrollment",
      action3: "Set Deadline",
    };
  }

  if (status === "draft" || status === "revision") {
    return {
      ...baseCourse,
      action1: "View Course",
      action2: "Set Deadline",
    };
  }

  return {
    ...baseCourse,
    action1: "View Course",
  };
}

export default function DepartmentTraining() {
  const navigate = useNavigate();

  const [data, setData] = useState(EMPTY_DATA);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [updatingCourseId, setUpdatingCourseId] =
    useState(null);
  const [error, setError] = useState("");

  const loadDepartmentTraining = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getManagerDepartmentTraining();

        setData({
          stats: {
            waitingForTrainer:
              result.stats?.waitingForTrainer || 0,
            inDevelopment:
              result.stats?.inDevelopment || 0,
            pendingReview:
              result.stats?.pendingReview || 0,
            publishedPrograms:
              result.stats?.publishedPrograms || 0,
          },
          courses: result.courses || [],
          upcomingDeadlines:
            result.upcomingDeadlines || [],
          recentActivities:
            result.recentActivities || [],
        });
      } catch (requestError) {
        console.error(
          "Failed to load department training:",
          requestError
        );

        setData(EMPTY_DATA);
        setError(
          requestError.message ||
            "Failed to load department training data."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDepartmentTraining();
  }, [loadDepartmentTraining]);

  async function updateCourse(courseId, payload) {
    try {
      setUpdatingCourseId(courseId);
      setError("");

      await updateManagerCourseReview(
        courseId,
        payload
      );

      await loadDepartmentTraining();
    } catch (requestError) {
      console.error(
        "Failed to update course:",
        requestError
      );

      setError(
        requestError.message ||
          "Failed to update the course."
      );
    } finally {
      setUpdatingCourseId(null);
    }
  }

  async function handleCourseAction(
    course,
    action
  ) {
    const normalizedAction = String(
      action || ""
    ).toLowerCase();

    if (normalizedAction === "view analytics") {
      navigate("/manager/analytics");
      return;
    }

    if (
      normalizedAction === "manage enrollment"
    ) {
      navigate("/manager/progress");
      return;
    }

    if (normalizedAction === "view course") {
      navigate(`/courses/${course.id}`);
      return;
    }

    if (normalizedAction === "approve course") {
      const confirmed = window.confirm(
        `Approve "${course.title}"?`
      );

      if (!confirmed) return;

      await updateCourse(course.id, {
        approval_status: "approved",
      });

      return;
    }

    if (
      normalizedAction === "request revision"
    ) {
      const confirmed = window.confirm(
        `Request a revision for "${course.title}"?`
      );

      if (!confirmed) return;

      await updateCourse(course.id, {
        approval_status: "revision",
      });

      return;
    }

    if (normalizedAction === "set deadline") {
      const deadline = window.prompt(
        "Enter the deadline in YYYY-MM-DD format:"
      );

      if (!deadline) return;

      const validDate =
        /^\d{4}-\d{2}-\d{2}$/.test(deadline);

      if (!validDate) {
        setError(
          "The deadline must use the YYYY-MM-DD format."
        );
        return;
      }

      await updateCourse(course.id, {
        deadline,
      });
    }
  }

  const statCards = [
    {
      title: "Waiting for Trainer",
      value: data.stats.waitingForTrainer,
      subtitle: "Approved courses without a trainer",
      color: "bg-indigo-100",
    },
    {
      title: "In Development",
      value: data.stats.inDevelopment,
      subtitle: "Courses currently being developed",
      color: "bg-blue-100",
    },
    {
      title: "Pending Review",
      value: data.stats.pendingReview,
      subtitle: "Courses waiting for manager review",
      color: "bg-red-100",
    },
    {
      title: "Published Programs",
      value: data.stats.publishedPrograms,
      subtitle: "Approved department courses",
      color: "bg-green-100",
    },
  ];

  const courseCards = data.courses.map(
    createCardData
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-indigo-700">
          Department Training
        </h1>

        <p className="mt-2 text-gray-500">
          Manage department training programs and
          course development.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <KPIStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Course Lifecycle Pipeline
            </h2>

            <div className="flex gap-3">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setViewMode("list")}
                className={`h-10 w-10 rounded-lg border ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                ☰
              </button>

              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
                className={`h-10 w-10 rounded-lg border ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                ⊞
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading department training...
            </div>
          ) : courseCards.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
              No department training available.
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 md:grid-cols-2"
                  : "space-y-6"
              }
            >
              {courseCards.map((course) => (
                <CoursePipelineCard
                  key={course.id}
                  course={course}
                  onAction={handleCourseAction}
                  disabled={
                    updatingCourseId === course.id
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <UpcomingDeadlines
            deadlines={data.upcomingDeadlines}
          />

          <RecentActivities
            activities={data.recentActivities}
          />
        </div>
      </div>
    </div>
  );
}
