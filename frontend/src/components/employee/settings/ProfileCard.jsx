import { useRef, useState } from "react";

export default function ProfileCard({ profile, onNameChange, onPhotoUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onPhotoUpload(file);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Profile Information
      </h2>

      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <img
            src={
              profile.photo_url ||
              `https://ui-avatars.com/api/?background=3046D3&color=fff&name=${encodeURIComponent(
                profile.full_name || "User"
              )}`
            }
            alt=""
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 bg-[#3046D3] text-white px-5 py-2 rounded-xl disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          <div>
            <label className="text-gray-500 text-sm">
              Full Name
            </label>
            <input
              className="w-full mt-2 border rounded-xl px-4 py-3"
              value={profile.full_name || ""}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-500 text-sm">
              Company Email
            </label>
            <input
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
              value={profile.email || ""}
              readOnly
            />
          </div>
          <div>
            <label className="text-gray-500 text-sm">
              Department
            </label>
            <input
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
              value={profile.department?.name || ""}
              readOnly
            />
          </div>
          <div>
            <label className="text-gray-500 text-sm">
              Employee Role
            </label>
            <input
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
              value={profile.role?.name || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
