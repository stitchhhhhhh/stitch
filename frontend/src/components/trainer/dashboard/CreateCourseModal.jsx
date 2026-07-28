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

  const selectedProgram = programs.find((p) => String(p.id) === String(programId));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!programId || !title.trim()) {
      setError("Program and course title are required.");
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
            <label className="text-sm font-medium text-gray-700">Target Training Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">Select training program...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.program_name} ({p.program_type === 'GENERAL' ? 'General Course' : 'Department Course'})
                </option>
              ))}
            </select>
          </div>

          {selectedProgram && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900">Course Category:</span>
              <span className="px-2.5 py-1 rounded-full font-bold bg-blue-600 text-white uppercase tracking-wider">
                {selectedProgram.program_type === 'GENERAL' ? 'General Course' : 'Department Course'}
              </span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Course Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. Cybersecurity Awareness 101"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
              placeholder="Provide a brief summary of the course content and objectives..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Target Deadline (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            />
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
              {saving ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

