import { useState } from "react";

import ProfileSection from "../../components/manager/settings/ProfileSection";
import AccountSettings from "../../components/manager/settings/AccountSettings";
import SecurityCard from "../../components/manager/settings/SecurityCard";
import NotificationPreferences from "../../components/manager/settings/NotificationPreferences";
import SettingsFooter from "../../components/manager/settings/SettingsFooter";

export default function Settings() {
  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      alert(
        "Manager settings berhasil disimpan di tampilan."
      );
    } catch (error) {
      alert(
        error?.message ||
          "Gagal menyimpan manager settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset semua pengaturan ke nilai awal?"
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
    <div className="space-y-8">
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
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#3046D3] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#253B80] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Preferences"}
        </button>
      </div>

      <ProfileSection />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AccountSettings />
        </div>

        <SecurityCard />
      </div>

      <NotificationPreferences />

      <SettingsFooter
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}