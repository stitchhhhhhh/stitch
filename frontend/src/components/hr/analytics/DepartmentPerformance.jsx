const departments = [
  {
    name: "Strategy & Operations",
    value: 98,
  },
  {
    name: "Engineering",
    value: 82,
  },
  {
    name: "Sales & Marketing",
    value: 74,
  },
  {
    name: "Finance",
    value: 61,
  },
];

export default function DepartmentPerformance() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-xl font-semibold">
          Department Performance
        </h2>

        <button className="text-gray-400 text-2xl">
          ⋮
        </button>

      </div>

      <div className="space-y-7">

        {departments.map((item) => (

          <div key={item.name}>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                {item.name}
              </span>

              <span className="font-bold text-[#2F3FE4]">
                {item.value}%
              </span>

            </div>

            <div className="w-full h-3 rounded-full bg-[#EEF2FF]">

              <div
                className="h-3 rounded-full bg-[#2F3FE4]"
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