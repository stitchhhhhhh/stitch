export default function ProgressStatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-5xl font-bold mt-3 text-[#253B80]">
        {value}
      </h2>

      <p className="text-gray-400 mt-3">
        {subtitle}
      </p>

    </div>
  );
}