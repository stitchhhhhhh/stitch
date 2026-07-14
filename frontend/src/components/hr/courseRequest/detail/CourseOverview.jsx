export default function CourseOverview() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-8">

      <h2 className="text-2xl font-bold text-[#253B80] mb-6">
        Course Overview
      </h2>

      <h4 className="uppercase text-sm font-semibold text-gray-400 mb-2">
        Description
      </h4>

      <p className="text-gray-600 leading-8">
        This course is designed for Senior Developers and
        Solution Architects who are looking to master
        modern cloud environments. It covers AWS,
        Azure and Google Cloud deployment patterns,
        disaster recovery, scalability and enterprise
        infrastructure.
      </p>

      <div className="grid grid-cols-2 gap-8 mt-8">

        <div>
          <h4 className="uppercase text-sm font-semibold text-gray-400">
            Target Audience
          </h4>

          <p className="mt-2 text-gray-700">
            Senior Engineers, Architects
          </p>
        </div>

        <div>
          <h4 className="uppercase text-sm font-semibold text-gray-400">
            Duration
          </h4>

          <p className="mt-2 text-gray-700">
            12 Hours (Self-paced)
          </p>
        </div>

      </div>

      <div className="mt-8">

        <h4 className="uppercase text-sm font-semibold text-gray-400 mb-3">
          Learning Objectives
        </h4>

        <ul className="space-y-3 text-gray-700">

          <li>✔ Design fault-tolerant cloud architecture.</li>

          <li>✔ Build CI/CD deployment pipelines.</li>

          <li>✔ Optimize cloud infrastructure cost.</li>

          <li>✔ Implement scalable enterprise solutions.</li>

        </ul>

      </div>

    </div>
  );
}