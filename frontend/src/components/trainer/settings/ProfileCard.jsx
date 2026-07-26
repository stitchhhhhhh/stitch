export default function ProfileCard({
  profile,
  onNameChange,
  onPhotoChange,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Trainer Profile
      </h2>

      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <img
            src={profile.photo_url || "/empty-picture.png"}
            alt={profile.full_name}
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
          />

          <label className="mt-4 bg-[#3046D3] text-white px-5 py-2 rounded-xl cursor-pointer">
            Change Photo

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                onPhotoChange?.(e.target.files?.[0])
              }
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          <div>
            <label className="text-gray-500 text-sm">
              Full Name
            </label>

            <input
              value={profile.full_name}
              onChange={(e) =>
                onNameChange?.(e.target.value)
              }
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">
              Company Email
            </label>

            <input
              readOnly
              value={profile.email}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">
              Department
            </label>

            <input
              readOnly
              value={profile.department?.name || "-"}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">
              Trainer Role
            </label>

            <input
              readOnly
              value={profile.role?.name || "-"}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}