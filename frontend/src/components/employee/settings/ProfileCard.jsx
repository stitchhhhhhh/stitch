export default function ProfileCard({
  profile,
  onNameChange,
}) {
  const avatarLetter =
    profile.full_name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <h2 className="mb-8 text-2xl font-bold text-[#253B80]">
        Profile Information
      </h2>

      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#3046D3] text-5xl font-bold text-white">
            {avatarLetter}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">
              Full Name
            </label>

            <input
              className="mt-2 w-full rounded-xl border px-4 py-3"
              value={profile.full_name || ""}
              onChange={(e) =>
                onNameChange(e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Company Email
            </label>

            <input
              className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-500"
              value={profile.email || ""}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Department
            </label>

            <input
              className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-500"
              value={
                profile.department?.name || ""
              }
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Employee Role
            </label>

            <input
              className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-500"
              value={
                profile.role?.name || ""
              }
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
