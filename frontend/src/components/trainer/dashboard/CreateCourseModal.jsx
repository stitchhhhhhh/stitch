import { useEffect, useState } from "react";
import { getPrograms, createCourse } from "../../../services/trainerService";

export default function CreateCourseModal({ onClose, onCreated }) {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPrograms().then(setPrograms).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!programId || !title.trim()) {
      setError("Program dan judul kursus wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const course = await createCourse({
        program_id: programId,
        course_title: title.trim(),
        description,
        deadline: deadline || null,
      });
      onCreated(course);
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
        <h2 className="text-2xl font-bold text-[#253B80] mb-6">Create New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            >
              <option value="">Pilih program...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Judul Kursus</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
              placeholder="Misal: Cyber Security Awareness"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Deadline (opsional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            />
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
              className="px-6 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
