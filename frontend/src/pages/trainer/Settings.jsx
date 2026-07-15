import ProfileCard from "../../components/trainer/settings/ProfileCard";
import AccountCard from "../../components/trainer/settings/AccountCard";
import SecurityCard from "../../components/trainer/settings/SecurityCard";
import NotificationPreferences from "../../components/trainer/settings/NotificationPreferences";
import FooterActions from "../../components/trainer/settings/FooterActions";

export default function TrainerSettings() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">

            Settings

          </h1>

          <p className="text-gray-500 mt-2">

            Manage your trainer profile and account preferences.

          </p>

        </div>

        <button
          className="
            px-8
            py-3
            rounded-xl
            bg-[#3046D3]
            text-white
            hover:bg-[#253B80]
            transition
          "
        >
          Save Preferences
        </button>

      </div>

      {/* Profile */}

      <ProfileCard />

      {/* Account + Security */}

      <div className="grid grid-cols-2 gap-8">

        <AccountCard />

        <SecurityCard />

      </div>

      {/* Notification */}

      <NotificationPreferences />

      {/* Footer */}

      <FooterActions />

    </div>
  );
}