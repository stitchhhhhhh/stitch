import { useState } from "react";

import ProfileCard from "../../components/trainer/settings/ProfileCard";
import AccountCard from "../../components/trainer/settings/AccountCard";
import SecurityCard from "../../components/trainer/settings/SecurityCard";
import NotificationPreferences from "../../components/trainer/settings/NotificationPreferences";
import FooterActions from "../../components/trainer/settings/FooterActions";

export default function TrainerSettings() {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      alert("Trainer settings berhasil disimpan.");
    } catch (error) {
      alert(
        error?.message ||
          "Gagal menyimpan trainer settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset settings ke nilai awal?"
    );

    if (!confirmed) return;

    window.location.reload();
  }

  function handleCancel() {
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
            Manage your trainer profile and account preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      <ProfileCard />

      <div className="grid grid-cols-2 gap-8">
        <AccountCard />
        <SecurityCard />
      </div>

      <NotificationPreferences />

      <FooterActions
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}