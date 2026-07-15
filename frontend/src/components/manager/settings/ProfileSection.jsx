import { profile } from "./settingsData";
import { User, Pencil } from "lucide-react";

export default function ProfileSection() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <div className="flex items-center gap-2 mb-8">
        <User size={20} className="text-[#3046D3]" />
        <h2 className="text-xl font-semibold">
          Profile Information
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-8 items-center">

        <div className="relative flex justify-center">

          <img
            src={profile.avatar}
            alt=""
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
          />

          <button
            className="
              absolute
              bottom-2
              right-10
              w-9
              h-9
              rounded-full
              bg-[#3046D3]
              text-white
              flex
              items-center
              justify-center
            "
          >
            <Pencil size={14} />
          </button>

        </div>

        <div className="col-span-4 grid grid-cols-2 gap-6">

          <div>
            <label className="text-xs text-gray-400 uppercase">
              Full Name
            </label>

            <input
              value={profile.name}
              readOnly
              className="
                mt-2
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-gray-50
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase">
              Company Email
            </label>

            <input
              value={profile.email}
              readOnly
              className="
                mt-2
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-gray-50
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase">
              Department
            </label>

            <input
              value={profile.department}
              readOnly
              className="
                mt-2
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-gray-50
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase">
              Role
            </label>

            <input
              value={profile.role}
              readOnly
              className="
                mt-2
                w-full
                border
                rounded-xl
                px-4
                py-3
                bg-gray-50
              "
            />
          </div>

        </div>

      </div>

    </div>
  );
}