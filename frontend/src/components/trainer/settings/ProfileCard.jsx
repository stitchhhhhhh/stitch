export default function ProfileCard({
  profile,
  onNameChange,
}) {
  const avatarLetter =
    profile?.full_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "T";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Trainer Profile
      </h2>

      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#3046D3] text-5xl font-bold text-white shadow-md">
            {avatarLetter}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div>
            <label className="text-gray-500 text-sm">
              Full Name
            </label>

            <input
              value={profile?.full_name || ""}
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
              value={profile?.email || ""}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">
              Department
            </label>

            <input
              readOnly
              value={profile?.department?.name || "-"}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">
              Trainer Role
            </label>

            <input
              readOnly
              value={profile?.role?.name || "-"}
              className="w-full mt-2 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}