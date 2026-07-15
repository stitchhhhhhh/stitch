import { account } from "./settingsData";

export default function AccountCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 h-full">

      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Account Settings
      </h2>

      <div className="space-y-5">

        <div className="bg-[#F7F8FF] rounded-2xl p-5 flex justify-between items-center">

          <div>

            <p className="font-semibold">
              SSO Connection
            </p>

            <p className="text-gray-500 mt-1">
              {account.sso}
            </p>

          </div>

          <div className="w-8 h-8 rounded-full bg-[#3046D3] text-white flex items-center justify-center">

            ✓

          </div>

        </div>

        <div className="bg-[#F7F8FF] rounded-2xl p-5 flex justify-between items-center">

          <div>

            <p className="font-semibold">
              Trainer Status
            </p>

            <p className="text-gray-500 mt-1">
              {account.status}
            </p>

          </div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-semibold">

            VERIFIED

          </span>

        </div>

      </div>

    </div>
  );
}