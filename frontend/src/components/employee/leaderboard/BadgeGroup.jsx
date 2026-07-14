export default function BadgeGroup({
  total = 12,
}) {
  return (
    <div className="flex items-center">

      <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-xs">
        🏆
      </div>

      <div className="-ml-2 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs">
        ⭐
      </div>

      <div className="-ml-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
        +{total}
      </div>

    </div>
  );
}