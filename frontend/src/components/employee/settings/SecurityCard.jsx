import { security } from "./settingsData";

export default function SecurityCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 h-full">

      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Security
      </h2>

      <div className="space-y-8">

        <div>

          <p className="text-gray-500 text-sm">

            Last Login

          </p>

          <h3 className="font-semibold mt-2">

            {security.lastLogin}

          </h3>

        </div>

        <hr />

        <div>

          <p className="text-gray-500 text-sm">

            SSO Provider

          </p>

          <h3 className="font-semibold mt-2">

            {security.provider}

          </h3>

        </div>

        <button className="text-[#3046D3] font-semibold">

          View Access Logs

        </button>

      </div>

    </div>
  );
}