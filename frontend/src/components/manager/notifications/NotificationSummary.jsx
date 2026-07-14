export default function NotificationSummary({
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-gray-500 text-sm">

        {title}

      </p>

      <h2 className="text-4xl font-bold text-[#253B80] mt-3">

        {value}

      </h2>

    </div>
  );
}