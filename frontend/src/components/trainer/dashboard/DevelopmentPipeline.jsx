import { pipeline } from "./dashboardData";

export default function DevelopmentPipeline() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-[#253B80]">
          Development Pipeline
        </h2>

        <span className="bg-blue-100 text-[#3046D3] px-3 py-1 rounded-full text-sm font-semibold">
          3 Active
        </span>

      </div>

      <div className="space-y-7">

        {pipeline.map((item) => (

          <div key={item.title}>

            <div className="flex justify-between items-center mb-2">

              <div>

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.note}
                </p>

              </div>

              <span className="text-sm font-medium text-[#3046D3]">
                {item.status}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className={`${item.color} h-2 rounded-full`}
                style={{
                  width: `${item.progress}%`,
                }}
              />

            </div>

            <p className="text-right text-xs text-gray-500 mt-2">
              {item.progress}%
            </p>

          </div>

        ))}

      </div>

      <div className="mt-8 border-t pt-6">

        <button
          className="
            w-full
            bg-[#3046D3]
            hover:bg-[#253B80]
            text-white
            py-3
            rounded-xl
            font-medium
          "
        >
          Course Templates
        </button>

      </div>

    </div>
  );
}