import { useState } from "react";

import {
  stats,
  requests,
  selectedRequest as initialRequest,
} from "../../components/trainer/course-requests/requestsData";

import RequestStatCard from "../../components/trainer/course-requests/RequestStatCard";
import FilterBar from "../../components/trainer/course-requests/FilterBar";
import RequestCard from "../../components/trainer/course-requests/RequestCard";
import RequestDetailPanel from "../../components/trainer/course-requests/RequestDetailPanel";

export default function CourseRequests() {
  const [selectedRequest, setSelectedRequest] =
    useState(initialRequest);

  const [requestList, setRequestList] =
    useState(requests);

  function handleAccept(request) {
    const confirmed = window.confirm(
      `Accept request "${request.title}"?`
    );

    if (!confirmed) return;

    setRequestList((current) =>
      current.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Accepted",
              statusColor: "bg-green-100 text-green-700",
            }
          : item
      )
    );

    setSelectedRequest((current) => ({
      ...current,
      status: "Accepted",
      statusColor: "bg-green-100 text-green-700",
    }));

    alert("Course request accepted.");
  }

  function handleReject(request) {
    const confirmed = window.confirm(
      `Reject request "${request.title}"?`
    );

    if (!confirmed) return;

    setRequestList((current) =>
      current.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Rejected",
              statusColor: "bg-red-100 text-red-700",
            }
          : item
      )
    );

    setSelectedRequest((current) => ({
      ...current,
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    }));

    alert("Course request rejected.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Course Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Review, evaluate, and manage incoming training requests.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <RequestStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <FilterBar />

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {requestList.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onView={setSelectedRequest}
            />
          ))}
        </div>

        <RequestDetailPanel
          request={selectedRequest}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}