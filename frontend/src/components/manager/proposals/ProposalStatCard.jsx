export default function ProposalStatCard({
  title,
  value,
  icon,
  bgColor,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 flex justify-between items-center">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {title}
        </p>

        <h2 className="text-5xl font-bold mt-2 text-[#222]">
          {value}
        </h2>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor}`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}