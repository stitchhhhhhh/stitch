import { useEffect, useState } from "react";

import ProfileSection from "../../components/manager/settings/ProfileSection";
import AccountSettings from "../../components/manager/settings/AccountSettings";
import SecurityCard from "../../components/manager/settings/SecurityCard";
import NotificationPreferences from "../../components/manager/settings/NotificationPreferences";
import SettingsFooter from "../../components/manager/settings/SettingsFooter";

import {
  getCurrentManagerProfile,
  updateManagerProfile,
  updateManagerNotifications,
  uploadManagerPhoto,
} from "../../services/managerService";

const emptyProfile = {
  id: null,
  full_name: "",
  email: "",
  photo_url: "",
  department: null,
  role: null,
  notify_course: false,
  notify_deadline: false,
  notify_certificate: false,
};

export default function Settings() {
  const [profile, setProfile] = useState(emptyProfile);
  const [initialProfile, setInitialProfile] =
    useState(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getCurrentManagerProfile();

      const normalizedProfile = {
        ...emptyProfile,
        ...result,
        notify_course:
          result.notify_course ?? false,
        notify_deadline:
          result.notify_deadline ?? false,
        notify_certificate:
          result.notify_certificate ?? false,
      };

      setProfile(normalizedProfile);
      setInitialProfile(normalizedProfile);
    } catch (err) {
      setError(
        err?.message ||
          "Gagal memuat manager settings."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleProfileChange(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNotificationChange(
    field,
    value
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePhotoUpload(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      alert(
        "Ukuran foto maksimal adalah 5 MB."
      );
      return;
    }

    try {
      setUploadingPhoto(true);

      const result =
        await uploadManagerPhoto(file);

      setProfile((current) => ({
        ...current,
        photo_url: result.photo_url,
      }));

      setInitialProfile((current) => ({
        ...current,
        photo_url: result.photo_url,
      }));

      alert("Foto profil berhasil diperbarui.");
    } catch (err) {
      alert(
        err?.message ||
          "Gagal mengunggah foto profil."
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave() {
    const trimmedName =
      profile.full_name.trim();

    if (!trimmedName) {
      alert("Nama lengkap tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const [
        updatedProfile,
        updatedNotifications,
      ] = await Promise.all([
        updateManagerProfile({
          full_name: trimmedName,
        }),
        updateManagerNotifications({
          notify_course:
            profile.notify_course,
          notify_deadline:
            profile.notify_deadline,
          notify_certificate:
            profile.notify_certificate,
        }),
      ]);

      const savedProfile = {
        ...profile,
        ...updatedProfile,
        ...updatedNotifications,
        full_name: trimmedName,
        department:
          updatedProfile.department ??
          profile.department,
        role:
          updatedProfile.role ??
          profile.role,
      };

      setProfile(savedProfile);
      setInitialProfile(savedProfile);

      alert(
        "Manager settings berhasil disimpan."
      );
    } catch (err) {
      alert(
        err?.message ||
          "Gagal menyimpan manager settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Kembalikan semua perubahan ke data terakhir yang tersimpan?"
    );

    if (!confirmed) return;

    setProfile(initialProfile);
  }

  function handleCancel() {
    const confirmed = window.confirm(
      "Batalkan semua perubahan yang belum disimpan?"
    );

    if (!confirmed) return;

    setProfile(initialProfile);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <p className="text-gray-500">
          Loading manager settings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <p className="text-red-600 mb-4">
          {error}
        </p>

        <button
          type="button"
          onClick={loadProfile}
          className="bg-[#3046D3] text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your department manager
            account settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploadingPhoto}
          className="bg-[#3046D3] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#253B80] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Preferences"}
        </button>
      </div>

      <ProfileSection
        profile={profile}
        onChange={handleProfileChange}
        onPhotoUpload={handlePhotoUpload}
        uploadingPhoto={uploadingPhoto}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountSettings />
        </div>

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
        onChange={
          handleNotificationChange
        }
      />

      <SettingsFooter
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={
          saving || uploadingPhoto
        }
      />
    </div>
  );
}