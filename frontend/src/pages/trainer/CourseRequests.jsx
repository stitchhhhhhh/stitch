import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getTrainerCourseRequests,
  updateCourseRequestStatus,
} from "../../services/trainerService";

import RequestStatCard from "../../components/trainer/course-requests/RequestStatCard";
import FilterBar from "../../components/trainer/course-requests/FilterBar";
import RequestCard from "../../components/trainer/course-requests/RequestCard";
import RequestDetailPanel from "../../components/trainer/course-requests/RequestDetailPanel";

const STATUS_CONFIG = {
  pending: {
    label: "New Request",
    color: "bg-blue-100 text-blue-700",
    progress: 0,
  },
  in_progress: {
    label: "Accepted",
    color: "bg-green-100 text-green-700",
    progress: 25,
  },
  submitted: {
    label: "In Development",
    color: "bg-orange-100 text-orange-700",
    progress: 75,
  },
  revision: {
    label: "Revision",
    color: "bg-yellow-100 text-yellow-700",
    progress: 60,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-200 text-gray-800",
    progress: 100,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    progress: 0,
  },
};

function CourseRequestsSkeleton() {
  return (
    <div
      className="space-y-8 animate-pulse"
      aria-label="Loading course requests"
    >
      <div className="space-y-3">
        <div className="h-10 w-72 rounded-xl bg-gray-200" />
        <div className="h-5 w-96 max-w-full rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 rounded-3xl bg-gray-200"
            />
          )
        )}
      </div>

      <div className="h-20 rounded-2xl bg-gray-200" />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-52 rounded-3xl bg-gray-200"
              />
            )
          )}
        </div>

        <div className="h-[520px] rounded-3xl bg-gray-200" />
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeRequest(request) {
  const rawStatus = String(request.status || "pending").toLowerCase();
  const statusConfig =
    STATUS_CONFIG[rawStatus] || STATUS_CONFIG.pending;

  const program = request.program || {};
  const requester = request.requester || {};

  const requesterName =
    requester.full_name ||
    requester.name ||
    requester.username ||
    requester.email ||
    "Unknown requester";

  const rawType =
    program.training_type ||
    program.program_type ||
    request.request_type ||
    request.type ||
    "Training";

  const rawPriority =
    request.priority ||
    program.priority ||
    "Normal";

  const priority = String(rawPriority);
  const priorityLower = priority.toLowerCase();

  const priorityColor =
    priorityLower === "high"
      ? "bg-red-100 text-red-700"
      : priorityLower === "medium"
        ? "bg-yellow-100 text-yellow-700"
        : priorityLower === "low"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700";

  return {
    ...request,
    id: request.id,
    rawStatus,
    title:
      program.program_name ||
      request.course?.course_title ||
      request.title ||
      `Course Request #${request.id}`,
    requester: requesterName,
    date: formatDate(
      request.created_at ||
      request.requested_at ||
      request.updated_at
    ),
    status: statusConfig.label,
    statusColor: statusConfig.color,
    progress: statusConfig.progress,
    type: String(rawType).replaceAll("_", " "),
    priority,
    priorityColor,
    objective:
      program.description ||
      request.objective ||
      "No learning objective has been provided.",
    audience: normalizeList(
      program.target_audience ||
      request.target_audience ||
      request.audience
    ),
    outcomes: normalizeList(
      program.learning_outcomes ||
      request.learning_outcomes ||
      request.outcomes
    ),
  };
}

export default function CourseRequests() {
  const { user } = useAuth();
  const trainerId = user?.user_id;

  const [requestList, setRequestList] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function loadRequests() {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getTrainerCourseRequests(trainerId);
      const normalized = Array.isArray(data)
        ? data.map(normalizeRequest)
        : [];

      setRequestList(normalized);

      setSelectedRequest((current) => {
        if (!current) return normalized[0] || null;

        return (
          normalized.find((item) => item.id === current.id) ||
          normalized[0] ||
          null
        );
      });
    } catch (err) {
      setError(err.message || "Failed to retrieve course requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [trainerId]);

  const stats = useMemo(
    () => [
      {
        title: "New Requests",
        value: requestList.filter(
          (request) => request.rawStatus === "pending"
        ).length,
        color: "text-[#3046D3]",
      },
      {
        title: "Accepted",
        value: requestList.filter(
          (request) => request.rawStatus === "in_progress"
        ).length,
        color: "text-green-600",
      },
      {
        title: "In Development",
        value: requestList.filter((request) =>
          ["submitted", "revision"].includes(request.rawStatus)
        ).length,
        color: "text-orange-500",
      },
      {
        title: "Completed",
        value: requestList.filter(
          (request) => request.rawStatus === "completed"
        ).length,
        color: "text-gray-800",
      },
    ],
    [requestList]
  );

  const requestTypes = useMemo(
    () => [...new Set(requestList.map((request) => request.type))],
    [requestList]
  );

  const filteredRequests = useMemo(() => {
    return requestList.filter((request) => {
      const matchesType =
        typeFilter === "all" || request.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        request.rawStatus === statusFilter;

      return matchesType && matchesStatus;
    });
  }, [requestList, typeFilter, statusFilter]);

  async function changeRequestStatus(request, status) {
    try {
      setUpdatingId(request.id);
      setError("");

      await updateCourseRequestStatus(request.id, status);
      await loadRequests();
    } catch (err) {
      setError(err.message || "Failed to update request.");
    } finally {
      setUpdatingId(null);
    }
  }

async function handleAccept(request) {
  await changeRequestStatus(
    request,
    "in_progress"
  );
}

async function handleReject(request) {
  await changeRequestStatus(
    request,
    "cancelled"
  );
}

  if (loading) {
  return <CourseRequestsSkeleton />;
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Course Requests
        </h1>

        <p className="mt-2 text-gray-500">
          Review, evaluate, and manage incoming training requests.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <RequestStatCard key={item.title} {...item} />
        ))}
      </div>

      <FilterBar
        types={requestTypes}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setTypeFilter("all");
          setStatusFilter("all");
        }}
      />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {filteredRequests.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
              No course requests found.
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onView={setSelectedRequest}
              />
            ))
          )}
        </div>

        <RequestDetailPanel
          request={selectedRequest}
          onAccept={handleAccept}
          onReject={handleReject}
          updating={
            selectedRequest?.id === updatingId
          }
        />
      </div>
    </div>
  );
}
