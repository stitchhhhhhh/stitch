import { User } from "lucide-react";

export default function ProfileSection({
  profile,
  onChange,
}) {
  const fullName =
    profile?.full_name ?? "";

  const email =
    profile?.email ?? "";

  const department =
    profile?.department?.name ??
    "Not Assigned";

  const role =
    profile?.role?.name ??
    "MANAGER";

  const initial =
    fullName
      .trim()
      .charAt(0)
      .toUpperCase() || "M";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div className="flex items-center gap-2 mb-8">
        <User
          size={20}
          className="text-[#3046D3]"
        />

        <h2 className="text-xl font-semibold">
          Profile Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-gray-100 bg-[#3046D3] text-white flex items-center justify-center text-4xl font-bold">
            {initial}
          </div>
        </div>

        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="manager-full-name"
              className="text-xs text-gray-400 uppercase"
            >
              Full Name
            </label>

            <input
              id="manager-full-name"
              value={fullName}
              onChange={(event) =>
                onChange(
                  "full_name",
                  event.target.value
                )
              }
              className="mt-2 w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3046D3]/20 focus:border-[#3046D3]"
            />
          </div>

          <div>
            <label
              htmlFor="manager-email"
              className="text-xs text-gray-400 uppercase"
            >
              Company Email
            </label>

            <input
              id="manager-email"
              value={email}
              readOnly
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="manager-department"
              className="text-xs text-gray-400 uppercase"
            >
              Department
            </label>

            <input
              id="manager-department"
              value={department}
              readOnly
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="manager-role"
              className="text-xs text-gray-400 uppercase"
            >
              Role
            </label>

            <input
              id="manager-role"
              value={role}
              readOnly
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}