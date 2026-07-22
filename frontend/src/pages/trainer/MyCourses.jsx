import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTrainerCourses } from "../../services/trainerService";

import CourseStatCard from "../../components/trainer/my-courses/CourseStatCard";
import CourseCard from "../../components/trainer/my-courses/CourseCard";
import QuickActions from "../../components/trainer/my-courses/QuickActions";
import RecentActivities from "../../components/trainer/my-courses/RecentActivities";
import CreateCourseModal from "../../components/trainer/dashboard/CreateCourseModal";
import UploadMaterialModal from "../../components/trainer/dashboard/UploadMaterialModal";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";

function getStatusDisplay(status) {
  const statusMap = {
    draft: {
      label: "Draft",
      badgeColor: "bg-gray-100 text-gray-700",
      primaryButton: "Edit Course",
    },
    submitted: {
      label: "Pending Review",
      badgeColor: "bg-yellow-100 text-yellow-700",
      primaryButton: "View Submission",
    },
    revision: {
      label: "Revision Required",
      badgeColor: "bg-red-100 text-red-600",
      primaryButton: "Revise Course",
    },
    approved: {
      label: "Published",
      badgeColor: "bg-green-100 text-green-600",
      primaryButton: "View Course",
    },
    rejected: {
      label: "Rejected",
      badgeColor: "bg-red-100 text-red-700",
      primaryButton: "View Course",
    },
  };

  return (
    statusMap[status] || {
      label: status || "Unknown",
      badgeColor: "bg-gray-100 text-gray-700",
      primaryButton: "View Course",
    }
  );
}

function calculateProgress(course) {
  if (course.approval_status === "approved") return 100;
  if (course.approval_status === "submitted") return 90;
  if (course.approval_status === "revision") return 60;

  let progress = 20;

  if (course.description) progress += 20;
  if ((course.materials || []).length > 0) progress += 30;
  if ((course.assessments || []).length > 0) progress += 30;

  return Math.min(progress, 100);
}

function formatDate(value) {
  if (!value) return "No update date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No update date";
  }

  return `Created ${date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function normalizeCourse(course) {
  const display = getStatusDisplay(course.approval_status);

  return {
    ...course,
    title: course.course_title || "Untitled Course",
    department:
      course.program?.department?.department_name ||
      "Company Training",
    trainingType:
      course.program?.program_type === "DEPARTMENT"
        ? "Department Training"
        : "General Training",
    status: display.label,
    progress: calculateProgress(course),
    image: course.image_url || FALLBACK_IMAGE,
    updated: formatDate(course.created_date),
    primaryButton: display.primaryButton,
    secondaryButton: "Details",
    badgeColor: display.badgeColor,
  };
}

export default function MyCourses() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);

  async function loadCourses() {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getTrainerCourses();

      const courseList = Array.isArray(response)
        ? response
        : response.data || response.courses || [];

      setCourses(courseList);
    } catch (err) {
      console.error("LOAD TRAINER COURSES ERROR:", err);
      setError(err.message || "Gagal mengambil course Trainer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, [user?.user_id]);

  const normalizedCourses = useMemo(
    () => courses.map(normalizeCourse),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    if (statusFilter === "all") {
      return normalizedCourses;
    }

    return normalizedCourses.filter(
      (course) => course.approval_status === statusFilter
    );
  }, [normalizedCourses, statusFilter]);

  const stats = useMemo(
    () => [
      {
        title: "Draft Courses",
        value: courses.filter(
          (course) => course.approval_status === "draft"
        ).length,
        color: "text-[#3046D3]",
        icon: "📝",
      },
      {
        title: "Revision",
        value: courses.filter(
          (course) => course.approval_status === "revision"
        ).length,
        color: "text-orange-500",
        icon: "⚙️",
      },
      {
        title: "Pending Review",
        value: courses.filter(
          (course) => course.approval_status === "submitted"
        ).length,
        color: "text-yellow-500",
        icon: "📋",
      },
      {
        title: "Published Courses",
        value: courses.filter(
          (course) => course.approval_status === "approved"
        ).length,
        color: "text-green-600",
        icon: "✅",
      },
    ],
    [courses]
  );

  function handleCreated() {
    setShowCreateCourse(false);
    loadCourses();
  }

  function handleUploaded() {
    setShowUploadMaterial(false);
    loadCourses();
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-3xl p-8">
        <p>{error}</p>

        <button
          type="button"
          onClick={loadCourses}
          className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            My Courses
          </h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <CourseStatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="border rounded-xl px-4 py-2 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="revision">Revision</option>
          <option value="submitted">Pending Review</option>
          <option value="approved">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
              No courses found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <QuickActions
            onUpload={() => setShowUploadMaterial(true)}
          />

          <RecentActivities courses={courses} />
        </div>
      </div>

      {showCreateCourse && (
        <CreateCourseModal
          onClose={() => setShowCreateCourse(false)}
          onCreated={handleCreated}
        />
      )}

      {showUploadMaterial && (
        <UploadMaterialModal
          courses={courses}
          onClose={() => setShowUploadMaterial(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
}