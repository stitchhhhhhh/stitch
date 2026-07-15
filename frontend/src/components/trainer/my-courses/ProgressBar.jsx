export default function ProgressBar({
  progress,
}) {
  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-sm text-gray-500">

          Progress

        </span>

        <span className="font-semibold">

          {progress}%

        </span>

      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

        <div
          className="h-full bg-[#3046D3] rounded-full transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}