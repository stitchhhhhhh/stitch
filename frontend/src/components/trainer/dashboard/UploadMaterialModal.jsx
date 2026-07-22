import { useRef, useState } from "react";
import { uploadMaterial } from "../../../services/trainerService";

const MATERIAL_TYPES = [
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "presentation", label: "Presentation" },
];

export default function UploadMaterialModal({ courses, onClose, onUploaded }) {
  const fileInputRef = useRef(null);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("document");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!courseId || !title.trim() || !file) {
      setError("Semua field wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const material = await uploadMaterial({
        course_id: courseId,
        material_title: title.trim(),
        material_type: type,
        file,
      });
      onUploaded(material);
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
        <h2 className="text-2xl font-bold text-[#253B80] mb-6">Upload Material</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Kursus</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            >
              <option value="">Pilih kursus...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Judul Materi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
              placeholder="Misal: Introduction to Cybersecurity"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Tipe Materi</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 border rounded-xl px-4 py-3"
            >
              {MATERIAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">File</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
              {saving ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
