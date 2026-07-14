import { security } from "./settingsData";
import {
  Shield,
  RotateCcw,
} from "lucide-react";

export default function SecurityCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex items-center gap-2 mb-8">

        <Shield
          size={20}
          className="text-[#3046D3]"
        />

        <h2 className="text-xl font-semibold">
          Security
        </h2>

      </div>

      <div className="space-y-6">

        <div>

          <p className="text-xs uppercase text-gray-400">
            Last Login
          </p>

          <div className="flex justify-between items-center mt-2">

            <h3 className="font-semibold">
              {security.lastLogin}
            </h3>

            <RotateCcw
              size={18}
              className="text-[#3046D3]"
            />

          </div>

        </div>

        <hr />

        <div>

          <p className="text-xs uppercase text-gray-400 mb-2">
            SSO Provider
          </p>

          <p className="font-medium">
            {security.provider}
          </p>

        </div>

        <button
          className="
            text-[#3046D3]
            font-semibold
            hover:underline
          "
        >
          View Access Logs →
        </button>

      </div>

    </div>
  );
}