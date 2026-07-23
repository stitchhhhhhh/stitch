import { useEffect, useState } from "react";

import ProfileCard from "../../components/trainer/settings/ProfileCard";
import AccountCard from "../../components/trainer/settings/AccountCard";
import SecurityCard from "../../components/trainer/settings/SecurityCard";
import NotificationPreferences from "../../components/trainer/settings/NotificationPreferences";
import FooterActions from "../../components/trainer/settings/FooterActions";

import {
  getCurrentTrainerProfile,
  updateTrainerProfile,
  updateTrainerNotifications,
  uploadTrainerPhoto,
} from "../../services/trainerService";

const emptyProfile = {
  id: null,
  full_name: "",
  email: "",
  status: "inactive",
  total_points: 0,
  photo_url: "",
  notify_course: true,
  notify_deadline: true,
  notify_certificate: false,
  department: null,
  role: null,
};

export default function TrainerSettings() {
  const [profile, setProfile] = useState(emptyProfile);
  const [initialProfile, setInitialProfile] =
    useState(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentTrainerProfile();

        if (!active) return;

        const normalizedProfile = {
          ...emptyProfile,
          ...data,
        };

        setProfile(normalizedProfile);
        setInitialProfile(normalizedProfile);
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Gagal mengambil trainer settings."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleNameChange(fullName) {
    setProfile((current) => ({
      ...current,
      full_name: fullName,
    }));
  }

  function handleNotificationChange(key, enabled) {
    setProfile((current) => ({
      ...current,
      [key]: enabled,
    }));
  }

  async function handlePhotoChange(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File yang dipilih harus berupa gambar.");
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      alert("Ukuran foto maksimal 5 MB.");
      return;
    }

    try {
      setUploadingPhoto(true);

      const updatedPhoto =
        await uploadTrainerPhoto(file);

      setProfile((current) => ({
        ...current,
        photo_url: updatedPhoto.photo_url,
      }));

      setInitialProfile((current) => ({
        ...current,
        photo_url: updatedPhoto.photo_url,
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
    const trimmedName = profile.full_name.trim();

    if (!trimmedName) {
      alert("Nama trainer tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const [updatedProfile, updatedNotifications] =
        await Promise.all([
          updateTrainerProfile(trimmedName),
          updateTrainerNotifications({
            notify_course: profile.notify_course,
            notify_deadline: profile.notify_deadline,
            notify_certificate:
              profile.notify_certificate,
          }),
        ]);

      const savedProfile = {
        ...profile,
        ...updatedProfile,
        ...updatedNotifications,
        full_name: trimmedName,
      };

      setProfile(savedProfile);
      setInitialProfile(savedProfile);

      alert("Trainer settings berhasil disimpan.");
    } catch (err) {
      const message =
        err?.message ||
        "Gagal menyimpan trainer settings.";

      setError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset perubahan ke data terakhir yang tersimpan?"
    );

    if (!confirmed) return;

    setProfile(initialProfile);
    setError("");
  }

  function handleCancel() {
    setProfile(initialProfile);
    setError("");
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <p className="text-gray-500">
          Loading trainer settings...
        </p>
      </div>
    );
  }

  if (error && !profile.id) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-700 font-medium">
          {error}
        </p>
      </div>
    );
  }

  const actionDisabled =
    saving || uploadingPhoto;

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
          disabled={actionDisabled}
          className="px-8 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? "Saving..."
            : uploadingPhoto
              ? "Uploading..."
              : "Save Preferences"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-700">
            {error}
          </p>
        </div>
      )}

      <ProfileCard
        profile={profile}
        onNameChange={handleNameChange}
        onPhotoChange={handlePhotoChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AccountCard profile={profile} />
        <SecurityCard profile={profile} />
      </div>

      <NotificationPreferences
        preferences={profile}
        onChange={handleNotificationChange}
        disabled={actionDisabled}
      />

      <FooterActions
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={actionDisabled}
      />
    </div>
  );
}
