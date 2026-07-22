import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getTrainerCourses,
  getTrainerCourseRequests,
  startCourseRequest,
} from "../../services/trainerService";

import StatCard from "../../components/trainer/dashboard/StatCard";
import CourseRequestsTable from "../../components/trainer/dashboard/CourseRequestsTable";
import DevelopmentPipeline from "../../components/trainer/dashboard/DevelopmentPipeline";
import RecentMaterials from "../../components/trainer/dashboard/RecentMaterials";
import RecentActivity from "../../components/trainer/dashboard/RecentActivity";
import CreateCourseModal from "../../components/trainer/dashboard/CreateCourseModal";
import UploadMaterialModal from "../../components/trainer/dashboard/UploadMaterialModal";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const trainerId = user?.user_id;

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);

  async function loadData() {
  if (!trainerId) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const [coursesRes, requestsRes] =
      await Promise.all([
        getTrainerCourses(),
        getTrainerCourseRequests(),
      ]);

    setCourses(
      Array.isArray(coursesRes)
        ? coursesRes
        : coursesRes.data ??
            coursesRes.courses ??
            []
    );

    setRequests(
      Array.isArray(requestsRes)
        ? requestsRes
        : requestsRes.data ??
            requestsRes.requests ??
            []
    );
  } catch (err) {
    console.error(
      "LOAD TRAINER DASHBOARD ERROR:",
      err
    );

    alert(
      err.message ||
        "Gagal mengambil dashboard Trainer."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadData();
  }, [trainerId]);

  async function handleAcceptRequest(requestId) {
    try {
      await startCourseRequest(requestId);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  const allMaterials = courses.flatMap((c) => c.materials ?? []);

  const stats = [
    {
      title: "Pending Requests",
      value: requests.filter((r) => r.status === "pending").length,
      color: "blue",
    },
    {
      title: "Draft Courses",
      value: courses.filter((c) => c.approval_status === "draft").length,
      color: "gray",
    },
    {
      title: "Pending Review",
      value: courses.filter((c) => c.approval_status === "submitted").length,
      color: "red",
    },
    {
      title: "Published Courses",
      value: courses.filter((c) => c.approval_status === "approved").length,
      color: "primary",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Trainer Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage course development, training requests, and learning materials.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowUploadMaterial(true)}
            className="border px-6 py-3 rounded-xl bg-white hover:bg-gray-100"
          >
            Upload Material
          </button>

          <button
            onClick={() => setShowCreateCourse(true)}
            className="bg-[#3046D3] hover:bg-[#253B80] text-white px-6 py-3 rounded-xl"
          >
            Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <CourseRequestsTable
            requests={requests}
            onAccept={handleAcceptRequest}
            onViewAll={() => navigate('/trainer/requests')}
          />
        </div>

        <DevelopmentPipeline courses={courses} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RecentMaterials
          materials={allMaterials}
          onViewAll={() => navigate('/trainer/courses')}
          onUpload={() => setShowUploadMaterial(true)}
        />
        <RecentActivity courses={courses} materials={allMaterials} />
      </div>

      {showCreateCourse && (
        <CreateCourseModal
          onClose={() => setShowCreateCourse(false)}
          onCreated={loadData}
        />
      )}

      {showUploadMaterial && (
        <UploadMaterialModal
          courses={courses}
          onClose={() => setShowUploadMaterial(false)}
          onUploaded={loadData}
        />
      )}
    </div>
  );
}
