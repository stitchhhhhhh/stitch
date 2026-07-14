import {
  stats,
  requests,
  selectedRequest,
} from "../../components/trainer/course-requests/requestsData";

import RequestStatCard from "../../components/trainer/course-requests/RequestStatCard";
import FilterBar from "../../components/trainer/course-requests/FilterBar";
import RequestCard from "../../components/trainer/course-requests/RequestCard";
import RequestDetailPanel from "../../components/trainer/course-requests/RequestDetailPanel";

export default function CourseRequests() {
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

          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))}

        </div>

        <RequestDetailPanel
          request={selectedRequest}
        />

      </div>

    </div>
  );
}