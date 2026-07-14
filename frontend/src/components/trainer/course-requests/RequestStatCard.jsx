export default function RequestStatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`text-5xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

    </div>
  );
}