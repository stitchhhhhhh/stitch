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
} from "../../services/trainerService";

const emptyProfile = {
  id: null,
  full_name: "",
  email: "",
  status: "inactive",
  total_points: 0,
  notify_course: true,
  notify_deadline: true,
  notify_certificate: false,
  department: null,
  role: null,
};

export default function TrainerSettings() {
  const [profile, setProfile] =
    useState(emptyProfile);

  const [initialProfile, setInitialProfile] =
    useState(emptyProfile);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCurrentTrainerProfile();

        if (!active) return;

        const normalizedProfile = {
          ...emptyProfile,
          ...data,
        };

        setProfile(normalizedProfile);
        setInitialProfile(
          normalizedProfile
        );
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Failed to load trainer settings."
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

  function handleNotificationChange(
    key,
    enabled
  ) {
    setProfile((current) => ({
      ...current,
      [key]: enabled,
    }));
  }

  async function handleSave() {
    const trimmedName =
      profile.full_name.trim();

    if (!trimmedName) {
      alert(
        "Trainer name cannot be empty."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const [
        updatedProfile,
        updatedNotifications,
      ] = await Promise.all([
        updateTrainerProfile(
          trimmedName
        ),

        updateTrainerNotifications({
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
      };

      setProfile(savedProfile);
      setInitialProfile(
        savedProfile
      );

      alert(
        "Trainer settings saved successfully."
      );
    } catch (err) {
      const message =
        err?.message ||
        "Failed to save trainer settings.";

      setError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset changes to the last saved data?"
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
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">
          Loading trainer settings...
        </p>
      </div>
    );
  }

  if (error && !profile.id) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Settings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your trainer profile and account preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#3046D3] px-8 py-3 text-white transition hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Preferences"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error}
          </p>
        </div>
      )}

      <ProfileCard
        profile={profile}
        onNameChange={
          handleNameChange
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AccountCard
          profile={profile}
        />

        <SecurityCard
          profile={profile}
        />
      </div>

      <NotificationPreferences
        preferences={profile}
        onChange={
          handleNotificationChange
        }
        disabled={saving}
      />

      <FooterActions
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}