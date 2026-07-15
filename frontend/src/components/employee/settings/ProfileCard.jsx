import { profile } from "./settingsData";

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Profile Information
      </h2>

      <div className="flex gap-8">

        <div className="flex flex-col items-center">

          <img
            src={profile.image}
            alt=""
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
          />

          <button className="mt-4 bg-[#3046D3] text-white px-5 py-2 rounded-xl">
            Change Photo
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">

          <div>

            <label className="text-gray-500 text-sm">
              Full Name
            </label>

            <input
              className="w-full mt-2 border rounded-xl px-4 py-3"
              value={profile.name}
              readOnly
            />

          </div>

          <div>

            <label className="text-gray-500 text-sm">
              Company Email
            </label>

            <input
              className="w-full mt-2 border rounded-xl px-4 py-3"
              value={profile.email}
              readOnly
            />

          </div>

          <div>

            <label className="text-gray-500 text-sm">
              Department
            </label>

            <input
              className="w-full mt-2 border rounded-xl px-4 py-3"
              value={profile.department}
              readOnly
            />

          </div>

          <div>

            <label className="text-gray-500 text-sm">
              Employee Role
            </label>

            <input
              className="w-full mt-2 border rounded-xl px-4 py-3"
              value={profile.role}
              readOnly
            />

          </div>

        </div>

      </div>

    </div>
  );
}