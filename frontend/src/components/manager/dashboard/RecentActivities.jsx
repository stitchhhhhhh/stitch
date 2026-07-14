export default function RecentActivities({ activities }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-semibold">
        Recent Activities
      </h2>

      <p className="text-gray-500 mt-2">
        Latest employee learning activities
      </p>

      <div className="mt-8 space-y-6">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-start"
          >

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-[#EEF2FF]
                flex
                items-center
                justify-center
                font-semibold
                text-[#2F3FE4]
              "
            >
              {item.name.charAt(0)}
            </div>

            <div className="flex-1">

              <p>

                <span className="font-semibold">
                  {item.name}
                </span>{" "}

                {item.action}{" "}

                <span className="text-[#2F3FE4]">
                  {item.course}
                </span>

              </p>

              <p className="text-gray-400 text-sm mt-1">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}