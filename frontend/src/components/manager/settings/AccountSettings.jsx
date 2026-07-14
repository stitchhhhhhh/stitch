import { accountSettings } from "./settingsData";
import {
  ShieldCheck,
  Building2,
  Globe,
} from "lucide-react";

const icons = {
  "SSO Connection": ShieldCheck,
  "Company Status": Building2,
  "Connected Organization": Globe,
};

export default function AccountSettings() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <h2 className="text-xl font-semibold mb-6">
        Account Settings
      </h2>

      <div className="space-y-5">

        {accountSettings.map((item) => {

          const Icon = icons[item.title];

          return (
            <div
              key={item.title}
              className="
                border
                rounded-2xl
                p-4
                flex
                items-center
                justify-between
              "
            >

              <div className="flex gap-4 items-center">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-[#EEF2FF]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    size={22}
                    className="text-[#3046D3]"
                  />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              {item.status && (

                <span
                  className="
                    bg-[#EEF9F1]
                    text-green-700
                    text-xs
                    px-3
                    py-1
                    rounded-full
                    font-medium
                  "
                >
                  {item.status}
                </span>

              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}