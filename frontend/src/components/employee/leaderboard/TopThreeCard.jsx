export default function TopThreeCard({
  user,
  center = false,
}) {
  if (!user) {
    return (
      <div className={`rounded-3xl border border-dashed border-gray-200 p-8 text-center text-gray-400 ${center ? 'py-12' : ''}`}>
        <p className="text-sm font-medium">Position Open</p>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-3xl
        shadow-sm
        transition
        duration-300
        hover:-translate-y-2

        ${
          center
            ? "bg-[#3046D3] text-white p-8"
            : "bg-white p-6"
        }
      `}
    >

      <div className="flex justify-center">

        <div className="relative">

          <img
            src={user.image}
            alt={user.name}
            className={`
              rounded-full object-cover

              ${
                center
                  ? "w-32 h-32 border-4 border-yellow-400"
                  : "w-24 h-24 border-4 border-gray-200"
              }
            `}
          />

          <div
            className={`
              absolute
              bottom-0
              right-0
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              font-bold
              text-sm

              ${
                center
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {user.rank}
          </div>

        </div>

      </div>

      <div className="text-center mt-6">

        <h2 className="text-2xl font-bold">

          {user.name}

        </h2>

        <p
          className={
            center
              ? "text-blue-100 mt-2"
              : "text-gray-500 mt-2"
          }
        >
          {user.department}
        </p>

        <div
          className={`
            mt-6
            inline-flex
            px-8
            py-3
            rounded-full
            font-bold

            ${
              center
                ? "bg-white/20"
                : "bg-[#EEF2FF] text-[#3046D3]"
            }
          `}
        >
          {user.points} pts
        </div>

        {center && (

          <p className="mt-6 uppercase text-xs tracking-widest text-blue-100">

            Top Performer of the Month

          </p>

        )}

      </div>

    </div>
  );
}