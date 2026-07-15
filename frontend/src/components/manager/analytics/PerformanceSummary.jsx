export default function PerformanceSummary() {
  return (
    <div className="bg-[#4453F2] text-white rounded-3xl p-8 shadow-lg">

      <h2 className="text-xl font-bold mb-8">

        Performance Summary

      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div>

          <p className="text-blue-100 text-sm">

            TOTAL ASSIGNED

          </p>

          <h3 className="text-4xl font-bold mt-2">

            50

          </h3>

        </div>

        <div>

          <p className="text-blue-100 text-sm">

            COMPLETED

          </p>

          <h3 className="text-4xl font-bold mt-2">

            42

          </h3>

        </div>

        <div>

          <p className="text-blue-100 text-sm">

            CERTIFICATES

          </p>

          <h3 className="text-4xl font-bold mt-2">

            38

          </h3>

        </div>

      </div>

    </div>
  );
}