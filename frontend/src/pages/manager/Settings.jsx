import ProfileSection from "../../components/manager/settings/ProfileSection";
import AccountSettings from "../../components/manager/settings/AccountSettings";
import SecurityCard from "../../components/manager/settings/SecurityCard";
import NotificationPreferences from "../../components/manager/settings/NotificationPreferences";
import SettingsFooter from "../../components/manager/settings/SettingsFooter";

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
            Manage your department manager account settings.
          </p>

        </div>

        <button
          className="
            bg-[#3046D3]
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
            hover:bg-[#253B80]
          "
        >
          Save Preferences
        </button>

      </div>

      {/* Profile */}

      <ProfileSection />

      {/* Account + Security */}

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">
          <AccountSettings />
        </div>

        <SecurityCard />

      </div>

      {/* Notifications */}

      <NotificationPreferences />

      {/* Footer */}

      <SettingsFooter />

    </div>
  );
}