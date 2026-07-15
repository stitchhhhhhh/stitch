import Breadcrumb from "../../components/hr/courseRequest/detail/Breadcrumb";
import CourseOverview from "../../components/hr/courseRequest/detail/CourseOverview";
import InstructorCard from "../../components/hr/courseRequest/detail/InstructorCard";
import ResourceCard from "../../components/hr/courseRequest/detail/ResourceCard";
import AssessmentCard from "../../components/hr/courseRequest/detail/AssessmentCard";
import ReviewActionBar from "../../components/hr/courseRequest/detail/ReviewActionBar";

export default function CourseRequestDetail() {
  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
            Pending Review
          </span>

          <h1 className="text-4xl font-bold text-[#253B80] mt-4">
            Advanced Cloud Architecture
          </h1>

          <p className="text-gray-500 mt-2 max-w-3xl">
            A comprehensive deep-dive into multi-cloud strategy,
            serverless orchestration, and high-availability
            patterns for enterprise-scale deployments.
          </p>
        </div>

        <div className="flex gap-3">

          <button className="px-6 py-3 rounded-xl border hover:bg-gray-50">
            Preview Mode
          </button>

          <button className="px-6 py-3 rounded-xl border hover:bg-gray-50">
            Share Review
          </button>

        </div>

      </div>

      {/* Main Content */}

      <div className="grid grid-cols-12 gap-6">

        {/* Left */}
        <div className="col-span-8 space-y-6">

          <CourseOverview />

          <ResourceCard />

        </div>

        {/* Right */}

        <div className="col-span-4 space-y-6">

          <InstructorCard />

          <AssessmentCard />

        </div>

      </div>

      {/* Bottom */}
      <ReviewActionBar />

    </div>
  );
}