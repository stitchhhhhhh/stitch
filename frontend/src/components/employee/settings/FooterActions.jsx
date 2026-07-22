export default function FooterActions({
  onSave,
  onCancel,
  onReset,
  saving = false,
}) {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
      >
        Reset Settings
      </button>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}