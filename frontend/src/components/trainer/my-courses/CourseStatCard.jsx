export default function CourseStatCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-5">

      <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-2xl">

        {icon}

      </div>

      <div>

        <p className="text-gray-500 text-sm">

          {title}

        </p>

        <h2 className={`text-3xl font-bold mt-1 ${color}`}>

          {value}

        </h2>

      </div>

    </div>
  );
}