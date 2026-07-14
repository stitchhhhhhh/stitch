export default function ProgressBar({ progress }) {
  return (
    <div className="w-full">

      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="h-full bg-[#3046D3] rounded-full transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <p className="text-xs text-gray-500 mt-2">
        {progress}% Complete
      </p>

    </div>
  );
}