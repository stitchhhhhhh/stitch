import { useEffect, useState } from "react";

import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  updateNotificationPreferences,
} from "../../services/userService";

import ProfileCard from "../../components/employee/settings/ProfileCard";
import AccountSettingsCard from "../../components/employee/settings/AccountSettingsCard";
import SecurityCard from "../../components/employee/settings/SecurityCard";
import NotificationPreferences from "../../components/employee/settings/NotificationPreferences";
import FooterActions from "../../components/employee/settings/FooterActions";

export default function Settings() {
  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState(null);

  const [initialProfile, setInitialProfile] =
    useState(null);

  const [nameInput, setNameInput] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    getMyProfile()
      .then((data) => {
        if (!isMounted) return;

        setProfile(data);
        setInitialProfile(data);
        setNameInput(
          data.full_name || ""
        );
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error(
          "LOAD SETTINGS ERROR:",
          err
        );

        alert(
          err?.message ||
            "Gagal mengambil data settings."
        );
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave() {
    const trimmedName =
      nameInput.trim();

    if (!trimmedName) {
      alert("Nama tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);

      const updated =
        await updateMyProfile(
          trimmedName
        );

      const nextProfile = {
        ...profile,
        ...updated,
        full_name:
          updated?.full_name ||
          trimmedName,
      };

      setProfile(nextProfile);
      setInitialProfile(nextProfile);
      setNameInput(
        nextProfile.full_name
      );

      alert(
        "Profil berhasil disimpan."
      );
    } catch (err) {
      alert(
        err?.message ||
          "Gagal menyimpan profil."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!initialProfile) return;

    setProfile(initialProfile);

    setNameInput(
      initialProfile.full_name || ""
    );
  }

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset pengaturan profil dan notifikasi ke data terakhir yang tersimpan?"
      );

    if (
      !confirmed ||
      !initialProfile
    ) {
      return;
    }

    setProfile(initialProfile);

    setNameInput(
      initialProfile.full_name || ""
    );
  }

  async function handlePhotoUpload(file) {
    const result =
      await uploadProfilePhoto(file);

    setProfile((prev) => ({
      ...prev,
      photo_url: result.photo_url,
    }));

    setInitialProfile((prev) => ({
      ...prev,
      photo_url: result.photo_url,
    }));
  }

  async function handleToggleNotification(
    key,
    value
  ) {
    const previousValue =
      profile?.[key] ?? false;

    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      await updateNotificationPreferences({
        [key]: value,
      });

      setInitialProfile((prev) => ({
        ...prev,
        [key]: value,
      }));
    } catch (err) {
      setProfile((prev) => ({
        ...prev,
        [key]: previousValue,
      }));

      alert(
        err?.message ||
          "Gagal menyimpan preferensi notifikasi."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading settings...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 text-red-600 rounded-2xl p-6">
        Data profil tidak tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your employee profile and account preferences.
        </p>
      </div>

      <ProfileCard
        profile={{
          ...profile,
          full_name: nameInput,
        }}
        onNameChange={setNameInput}
        onPhotoUpload={
          handlePhotoUpload
        }
      />

      <div className="grid grid-cols-2 gap-8">
        <AccountSettingsCard />
        <SecurityCard />
      </div>

      <NotificationPreferences
        preferences={{
          notify_course:
            profile.notify_course,
          notify_deadline:
            profile.notify_deadline,
          notify_certificate:
            profile.notify_certificate,
        }}
        onToggle={
          handleToggleNotification
        }
      />

      <FooterActions
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        saving={saving}
      />
    </div>
  );
}