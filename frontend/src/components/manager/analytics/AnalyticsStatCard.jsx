export default function AnalyticsStatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-[#253B80] mt-3">
        {value}
      </h2>

      <p className="text-sm text-green-600 mt-3">
        {subtitle}
      </p>

    </div>
  );
}