export default function BottomActions() {
  return (
    <div className="flex justify-between items-center pt-2">

      <button className="text-gray-500">
        ⟳ Reset Settings
      </button>

      <div className="flex gap-4">

        <button className="px-8 py-3 rounded-xl border">
          Cancel
        </button>

        <button className="px-8 py-3 rounded-xl bg-[#2F3FE4] text-white shadow">
          Save Changes
        </button>

      </div>

    </div>
  );
}