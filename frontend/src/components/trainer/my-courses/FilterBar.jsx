export default function FilterBar({
  trainingType,
  status,
  onTrainingTypeChange,
  onStatusChange,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row">
        <select
          value={trainingType}
          onChange={(event) => onTrainingTypeChange(event.target.value)}
          className="px-5 py-3 rounded-xl border bg-white"
        >
          <option value="all">Training Type (All)</option>
          <option value="GENERAL">General Training</option>
          <option value="DEPARTMENT">Department Training</option>
        </select>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="px-5 py-3 rounded-xl border bg-white"
        >
          <option value="all">Status (All)</option>
          <option value="draft">Draft</option>
          <option value="development">In Development</option>
          <option value="submitted">Pending Review</option>
          <option value="approved">Published</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="text-[#3046D3] font-semibold hover:underline"
      >
        Clear Filters
      </button>
    </div>
  );
}
