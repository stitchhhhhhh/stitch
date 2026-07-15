export default function TopPerformers({
  title,
  performers,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-semibold">
            {title}
          </h2>

          <p className="text-gray-500 mt-2">
            Highest performing employees this month
          </p>

        </div>

        <button className="text-[#2F3FE4] font-medium">
          View All
        </button>

      </div>

      <div className="mt-8 space-y-5">

        {performers.map((item, index) => (

          <div
            key={index}
            className="
              flex
              justify-between
              items-center
              border
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-[#EEF2FF]
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-[#2F3FE4]
                  text-lg
                "
              >
                {item.name.charAt(0)}
              </div>

              <div>

                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {item.role}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-3xl font-bold text-[#2F3FE4]">
                {item.score}
              </p>

              <p className="text-gray-400 text-sm">
                Overall Score
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}