export default function ProgramPerformance({ performance }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-semibold">
        Program Performance
      </h2>

      <p className="text-gray-500 mt-2">
        Average score by training program
      </p>

      <div className="mt-8 space-y-6">

        {performance.map((item, index) => (

          <div key={index}>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                {item.course}
              </span>

              <span className="font-semibold">
                {item.value}%
              </span>

            </div>

            <div className="bg-gray-100 h-3 rounded-full">

              <div
                className="bg-[#2F3FE4] h-3 rounded-full"
                style={{
                  width: `${item.value}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}