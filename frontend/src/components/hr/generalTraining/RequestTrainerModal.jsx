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
      setError("Program dan trainer wajib dipilih.");
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
        <h2 className="text-2xl font-bold text-[#253B80] mb-6">Request Course ke Trainer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            >
              <option value="">Select a program...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Trainer</label>
            <select
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            >
              <option value="">Select a trainer...</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#3948F2] text-white hover:bg-[#2836d9] disabled:opacity-50"
            >
              {saving ? "Mengirim..." : "Kirim Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
