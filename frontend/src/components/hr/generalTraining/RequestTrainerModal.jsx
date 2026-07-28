import { useEffect, useState } from "react";
import { getTrainers, requestCourseFromTrainer } from "../../../services/hrService";

export default function RequestTrainerModal({ programs, onClose, onRequested }) {
  const [trainers, setTrainers] = useState([]);
  const [programId, setProgramId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrainers().then(setTrainers).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!programId || !trainerId) {
      setError("Please select both a program and a trainer.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await requestCourseFromTrainer({ program_id: programId, trainer_id: trainerId });
      onRequested();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#253B80] mb-6">Request Course Creation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Target Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">Select training program...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.program_name} ({p.program_type === 'GENERAL' ? 'General' : 'Department'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Assigned Trainer</label>
            <select
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">Select active trainer...</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border text-gray-600 hover:bg-gray-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] font-medium disabled:opacity-50 transition"
            >
              {saving ? "Sending..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

