import { useState } from "react";

import ProfileCard from "../../components/hr/settings/ProfileCard";
import AccountSettings from "../../components/hr/settings/AccountSettings";
import SecurityCard from "../../components/hr/settings/SecurityCard";
import NotificationSettings from "../../components/hr/settings/NotificationSettings";
import ReportSettings from "../../components/hr/settings/ReportSettings";
import BottomActions from "../../components/hr/settings/BottomActions";

export default function Settings() {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      alert("HR settings berhasil disimpan.");
    } catch (error) {
      alert(
        error?.message ||
          "Gagal menyimpan HR settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset semua pengaturan HR?"
    );

    if (!confirmed) return;

    window.location.reload();
  }

  function handleCancel() {
    const confirmed = window.confirm(
      "Batalkan semua perubahan?"
    );

    if (!confirmed) return;

    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#253B80]">
          Settings
        </h1>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2F3FE4] text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
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

      <BottomActions
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}