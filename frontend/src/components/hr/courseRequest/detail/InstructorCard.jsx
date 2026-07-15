export default function InstructorCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6 text-center">

      <img
        src="https://i.pravatar.cc/150?img=32"
        alt="Instructor"
        className="w-24 h-24 rounded-full mx-auto"
      />

      <h3 className="text-2xl font-bold mt-4">
        Dr. Sarah Jenkins
      </h3>

      <p className="text-[#2F3FE4] font-medium">
        Principal Cloud Architect
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mt-6 text-left">

        <h4 className="text-xs uppercase font-semibold text-gray-500">
          Expertise
        </h4>

        <p className="mt-2 text-gray-700">
          Kubernetes, Terraform,
          Serverless, AWS,
          Cloud Security
        </p>

      </div>

      <div className="mt-6 text-left">

        <h4 className="text-xs uppercase font-semibold text-gray-500 mb-3">
          Previous Courses
        </h4>

        <ul className="space-y-2 text-[#2F3FE4]">

          <li>Fundamentals of AWS</li>

          <li>Microservices Security</li>

        </ul>

      </div>

    </div>
  );
}