import { useEffect, useMemo, useState } from "react";

import {
  getTrainerCourseRequests,
  startCourseRequest,
  rejectCourseRequest,
} from "../../services/trainerService";

import RequestStatCard from "../../components/trainer/course-requests/RequestStatCard";
import RequestCard from "../../components/trainer/course-requests/RequestCard";
import RequestDetailPanel from "../../components/trainer/course-requests/RequestDetailPanel";

function getStatusDisplay(status) {
  const statuses = {
    pending: {
      label: "New Request",
      color: "bg-blue-100 text-blue-700",
      progress: 0,
    },
    in_progress: {
      label: "In Development",
      color: "bg-indigo-100 text-indigo-700",
      progress: 40,
    },
    submitted: {
      label: "Submitted",
      color: "bg-yellow-100 text-yellow-700",
      progress: 90,
    },
    revision: {
      label: "Revision Required",
      color: "bg-red-100 text-red-700",
      progress: 60,
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-700",
      progress: 100,
    },
    rejected: {
      label: "Rejected",
      color: "bg-gray-100 text-gray-700",
      progress: 0,
    },
  };

  return (
    statuses[status] || {
      label: status || "Unknown",
      color: "bg-gray-100 text-gray-700",
      progress: 0,
    }
  );
}

function normalizeRequest(request) {
  const status = getStatusDisplay(request.status);

  return {
    ...request,
    title:
      request.program?.program_name ||
      "Untitled Training Program",
    objective:
      request.program?.description ||
      "No learning objective was provided.",
    statusLabel: status.label,
    statusColor: status.color,
    requester:
      request.requester?.full_name ||
      request.requester?.email ||
      "HR or Manager",
    type:
      request.program?.program_type === "DEPARTMENT"
        ? "Department Training"
        : "General Training",
    date: request.request_date
      ? new Date(request.request_date).toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : "-",
    progress: status.progress,
  };
}

export default function CourseRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] =
    useState(null);
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState(null);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTrainerCourseRequests();

      const requestList = Array.isArray(response)
        ? response
        : response.data || response.requests || [];

      setRequests(requestList);

      if (
        requestList.length > 0 &&
        !selectedRequestId
      ) {
        setSelectedRequestId(requestList[0].id);
      }
    } catch (err) {
      console.error(
        "LOAD COURSE REQUESTS ERROR:",
        err
      );

      setError(
        err.message ||
          "Gagal mengambil course request."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const normalizedRequests = useMemo(
    () => requests.map(normalizeRequest),
    [requests]
  );

  const selectedRequest =
    normalizedRequests.find(
      (request) =>
        request.id === selectedRequestId
    ) || null;

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") {
      return normalizedRequests;
    }

    return normalizedRequests.filter(
      (request) =>
        request.status === statusFilter
    );
  }, [normalizedRequests, statusFilter]);

  const stats = useMemo(
    () => [
      {
        title: "New Requests",
        value: requests.filter(
          (request) => request.status === "pending"
        ).length,
        color: "text-[#3046D3]",
      },
      {
        title: "In Development",
        value: requests.filter(
          (request) =>
            request.status === "in_progress"
        ).length,
        color: "text-orange-500",
      },
      {
        title: "Submitted",
        value: requests.filter(
          (request) =>
            request.status === "submitted"
        ).length,
        color: "text-yellow-600",
      },
      {
        title: "Completed",
        value: requests.filter(
          (request) =>
            request.status === "completed"
        ).length,
        color: "text-green-600",
      },
    ],
    [requests]
  );

  async function handleAccept(request) {
    const confirmed = window.confirm(
      `Start working on "${request.title}"?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(request.id);
      await startCourseRequest(request.id);
      await loadRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(request) {
    const confirmed = window.confirm(
      `Reject request "${request.title}"?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(request.id);
      await rejectCourseRequest(request.id);
      await loadRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
        Loading course requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-3xl p-8">
        <p>{error}</p>

        <button
          type="button"
          onClick={loadRequests}
          className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Course Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Review and manage incoming training requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <RequestStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="border rounded-xl px-4 py-2 outline-none"
        >
          <option value="all">All Requests</option>
          <option value="pending">New Requests</option>
          <option value="in_progress">
            In Development
          </option>
          <option value="submitted">Submitted</option>
          <option value="revision">Revision</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-gray-500">
              No course requests found.
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onView={(item) =>
                  setSelectedRequestId(item.id)
                }
              />
            ))
          )}
        </div>

        <RequestDetailPanel
          request={selectedRequest}
          onAccept={handleAccept}
          onReject={handleReject}
          processing={
            processingId === selectedRequest?.id
          }
        />
      </div>
    </div>
  );
}