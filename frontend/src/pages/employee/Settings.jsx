import ProfileCard from "../../components/employee/settings/ProfileCard";
import AccountSettingsCard from "../../components/employee/settings/AccountSettingsCard";
import SecurityCard from "../../components/employee/settings/SecurityCard";
import NotificationPreferences from "../../components/employee/settings/NotificationPreferences";
import FooterActions from "../../components/employee/settings/FooterActions";

export default function Settings() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your employee profile and account preferences.
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

        <AccountSettingsCard />

        <SecurityCard />

      </div>

      {/* Notifications */}

      <NotificationPreferences />

      {/* Footer */}

      <FooterActions />

    </div>
  );
}