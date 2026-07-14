import ProfileCard from "../../components/hr/settings/ProfileCard";
import AccountSettings from "../../components/hr/settings/AccountSettings";
import SecurityCard from "../../components/hr/settings/SecurityCard";
import NotificationSettings from "../../components/hr/settings/NotificationSettings";
import ReportSettings from "../../components/hr/settings/ReportSettings";
import BottomActions from "../../components/hr/settings/BottomActions";

export default function Settings() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#253B80]">
          Settings
        </h1>

        <button className="bg-[#2F3FE4] text-white px-6 py-3 rounded-xl">
          Save Preferences
        </button>
      </div>

      <ProfileCard />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <AccountSettings />
        </div>

        <div className="col-span-5">
          <SecurityCard />
        </div>
      </div>

      <NotificationSettings />

      <ReportSettings />

      <BottomActions />

    </div>
  );
}