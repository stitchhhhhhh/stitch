export default function DashboardHeader({
  data,
  onExport,
  onAssign,
  exporting = false,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            {data.title}
          </h1>

          <p className="text-gray-500 mt-3 max-w-3xl">
            {data.description}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting ? "Exporting..." : data.exportButton}
          </button>

          <button
            type="button"
            onClick={onAssign}
            className="px-6 py-3 rounded-xl bg-[#2F3FE4] text-white hover:bg-[#2535d9]"
          >
            {data.assignButton}
          </button>
        </div>
      </div>
    </div>
  );
}