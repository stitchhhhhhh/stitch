import RequestStats from "../../components/hr/courseRequest/RequestStats";
import RequestCard from "../../components/hr/courseRequest/RequestCard";
import RequestDetail from "../../components/hr/courseRequest/RequestDetail";

export default function CourseRequests() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Course Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Review and approve submitted courses from trainers.
        </p>
      </div>

      <RequestStats />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8 space-y-5">

          <div className="flex gap-3">

            <button className="bg-[#EEF2FF] rounded-full px-5 py-2">
              Filter
            </button>

            <button className="bg-[#EEF2FF] rounded-full px-5 py-2">
              Sort by : Newest
            </button>

          </div>

          <RequestCard />
          <RequestCard />
          <RequestCard />

        </div>

        <div className="col-span-4">
          <RequestDetail />
        </div>

      </div>

    </div>
  );
}