import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getTrainerCourses,
  getTrainerCourseRequests,
  updateCourseRequestStatus,
  deleteMaterial,
} from "../../services/trainerService";

import StatCard from "../../components/trainer/dashboard/StatCard";
import CourseRequestsTable from "../../components/trainer/dashboard/CourseRequestsTable";
import DevelopmentPipeline from "../../components/trainer/dashboard/DevelopmentPipeline";
import RecentMaterials from "../../components/trainer/dashboard/RecentMaterials";
import RecentActivity from "../../components/trainer/dashboard/RecentActivity";
import CreateCourseModal from "../../components/trainer/dashboard/CreateCourseModal";
import UploadMaterialModal from "../../components/trainer/dashboard/UploadMaterialModal";

function DashboardSkeleton() {
  return (
    <div
      className="space-y-8 animate-pulse"
      aria-label="Loading trainer dashboard"
    >
      <div className="flex justify-between items-center gap-6">
        <div className="space-y-3">
          <div className="h-10 w-72 rounded-xl bg-gray-200" />
          <div className="h-5 w-96 max-w-full rounded-lg bg-gray-200" />
        </div>

        <div className="flex gap-4">
          <div className="h-12 w-36 rounded-xl bg-gray-200" />
          <div className="h-12 w-36 rounded-xl bg-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-2xl bg-gray-200"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-72 rounded-2xl bg-gray-200 xl:col-span-2" />
        <div className="h-72 rounded-2xl bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-56 rounded-2xl bg-gray-200" />
        <div className="h-56 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const trainerId = user?.user_id;

  const [loading, setLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] =
    useState(null);

  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const [showCreateCourse, setShowCreateCourse] =
  useState(false);

const [showUploadMaterial, setShowUploadMaterial] =
  useState(false);

const [
  deletingMaterialId,
  setDeletingMaterialId,
] = useState(null);

const [successMessage, setSuccessMessage] =
  useState("");

  const loadData = useCallback(async () => {
    if (!trainerId) {
      setCourses([]);
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [coursesResponse, requestsResponse] =
        await Promise.all([
          getTrainerCourses(),
          getTrainerCourseRequests(trainerId),
        ]);

      setCourses(
        Array.isArray(coursesResponse)
          ? coursesResponse
          : []
      );

      setRequests(
        Array.isArray(requestsResponse)
          ? requestsResponse
          : []
      );
    } catch (requestError) {
      console.error(
        "Failed to load trainer dashboard:",
        requestError
      );

      setCourses([]);
      setRequests([]);

      setError(
        requestError?.message ||
          "Failed to load the trainer dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [trainerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAcceptRequest(requestId) {
    if (!requestId || processingRequestId) {
      return;
    }

    try {
      setProcessingRequestId(requestId);
      setError("");

      await updateCourseRequestStatus(
        requestId,
        "in_progress"
      );

      await loadData();
    } catch (requestError) {
      console.error(
        "Failed to accept course request:",
        requestError
      );

      setError(
        requestError?.message ||
          "Failed to accept the course request."
      );
    } finally {
      setProcessingRequestId(null);
    }
  }

  function handleOpenUploadModal() {
    if (courses.length === 0) {
      setError(
        "Create a course before uploading learning materials."
      );
      return;
    }

    setError("");
    setShowUploadMaterial(true);
  }

  async function handleDeleteMaterial(
  material
) {
  const materialId = Number(
    material?.id
  );

  if (
    !Number.isInteger(materialId) ||
    materialId <= 0 ||
    deletingMaterialId
  ) {
    return;
  }

  const materialTitle =
    material?.material_title ||
    "this material";

  const confirmed =
    window.confirm(
      `Are you sure you want to delete "${materialTitle}"?`
    );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingMaterialId(
      materialId
    );

    setError("");
    setSuccessMessage("");

    await deleteMaterial(
      materialId
    );

    await loadData();

    setSuccessMessage(
      "Learning material deleted successfully."
    );
  } catch (deleteError) {
    console.error(
      "Failed to delete material:",
      deleteError
    );

    setError(
      deleteError?.message ||
        "Failed to delete the learning material."
    );
  } finally {
    setDeletingMaterialId(null);
  }
}

  const allMaterials = useMemo(
  () =>
    courses.flatMap((course) =>
      Array.isArray(course.materials)
        ? course.materials.map(
            (material) => ({
              ...material,
              course_id: course.id,
              course_title:
                course.course_title ||
                course.title ||
                "",
              course_status:
                course.approval_status ||
                "",
            })
          )
        : []
    ),
  [courses]
);

  const stats = useMemo(
    () => [
      {
        title: "Pending Requests",
        value: requests.filter(
          (request) =>
            request.status === "pending"
        ).length,
        color: "blue",
      },
      {
        title: "Draft Courses",
        value: courses.filter(
          (course) =>
            course.approval_status === "draft"
        ).length,
        color: "gray",
      },
      {
        title: "Pending Review",
        value: courses.filter(
          (course) =>
            course.approval_status ===
            "submitted"
        ).length,
        color: "red",
      },
      {
        title: "Published Courses",
        value: courses.filter(
          (course) =>
            course.approval_status ===
            "approved"
        ).length,
        color: "primary",
      },
    ],
    [courses, requests]
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Trainer Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage course development, training requests,
            and learning materials.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleOpenUploadModal}
            disabled={courses.length === 0}
            title={
              courses.length === 0
                ? "Create a course before uploading materials."
                : "Upload learning material"
            }
            className="border px-6 py-3 rounded-xl bg-white hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100"
          >
            Upload Material
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowCreateCourse(true);
            }}
            className="bg-[#3046D3] hover:bg-[#253B80] text-white px-6 py-3 rounded-xl"
          >
            Create Course
          </button>
        </div>
      </header>

      {successMessage && (
  <div
    role="status"
    className="flex items-start justify-between gap-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
  >
    <p>{successMessage}</p>

    <button
      type="button"
      onClick={() =>
        setSuccessMessage("")
      }
      className="font-semibold hover:underline cursor-pointer"
      aria-label="Dismiss success message"
    >
      Dismiss
    </button>
  </div>
)}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CourseRequestsTable
            requests={requests}
            onAccept={handleAcceptRequest}
            processingRequestId={
              processingRequestId
            }
            onViewAll={() =>
              navigate("/trainer/requests")
            }
          />
        </div>

        <DevelopmentPipeline
          courses={courses}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentMaterials
  materials={allMaterials}
  onViewAll={() =>
    navigate("/trainer/courses")
  }
  onUpload={handleOpenUploadModal}
  onDelete={
    handleDeleteMaterial
  }
  deletingMaterialId={
    deletingMaterialId
  }
  uploadDisabled={
    courses.length === 0
  }
/>

        <RecentActivity
          courses={courses}
          materials={allMaterials}
        />
      </div>

      {showCreateCourse && (
        <CreateCourseModal
          onClose={() =>
            setShowCreateCourse(false)
          }
          onCreated={async () => {
            setShowCreateCourse(false);
            await loadData();
          }}
        />
      )}

      {showUploadMaterial &&
        courses.length > 0 && (
          <UploadMaterialModal
            courses={courses}
            onClose={() =>
              setShowUploadMaterial(false)
            }
            onUploaded={async () => {
              setShowUploadMaterial(false);
              await loadData();
            }}
          />
        )}
    </div>
  );
}
