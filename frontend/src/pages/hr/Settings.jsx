import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
  updateNotificationPreferences,
} from "../../services/userService";

const emptyProfile = {
  id: null,
  full_name: "",
  email: "",
  status: "inactive",
  department: null,
  role: null,
  notify_course: false,
  notify_deadline: false,
  notify_certificate: false,
};

export default function Settings() {
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
          await getMyProfile();

        if (!active) return;

        const normalizedProfile = {
          ...emptyProfile,
          ...data,
          notify_course:
            data?.notify_course ?? false,
          notify_deadline:
            data?.notify_deadline ?? false,
          notify_certificate:
            data?.notify_certificate ?? false,
        };

        setProfile(normalizedProfile);
        setInitialProfile(
          normalizedProfile
        );
      } catch (err) {
        if (!active) return;

        setError(
          err?.message ||
            "Failed to load HR settings."
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

  function handleProfileChange(
    field,
    value
  ) {
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

  async function handleSave() {
    const trimmedName =
      profile.full_name.trim();

    if (!trimmedName) {
      alert(
        "Full name cannot be empty."
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
        updateMyProfile(trimmedName),

        updateNotificationPreferences({
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
          updatedProfile?.department ??
          profile.department,
        role:
          updatedProfile?.role ??
          profile.role,
      };

      setProfile(savedProfile);
      setInitialProfile(
        savedProfile
      );

      alert(
        "HR settings saved successfully."
      );
    } catch (err) {
      const message =
        err?.message ||
        "Failed to save HR settings.";

      setError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    const confirmed =
      window.confirm(
        "Cancel all unsaved changes?"
      );

    if (!confirmed) return;

    setProfile(initialProfile);
    setError("");
  }

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset settings to the last saved data?"
      );

    if (!confirmed) return;

    setProfile(initialProfile);
    setError("");
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">
          Loading HR settings...
        </p>
      </div>
    );
  }

  const fullName =
    profile.full_name || "";

  const initial =
    fullName
      .trim()
      .charAt(0)
      .toUpperCase() || "H";

  const departmentName =
    profile.department?.name ||
    "Not Assigned";

  const roleName =
    profile.role?.name ||
    "HR";

  const accountStatus =
    String(
      profile.status ||
        "inactive"
    ).toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#253B80]">
            Settings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your HR profile and account preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#3046D3] px-8 py-3 font-medium text-white transition hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Profile Information */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-2">
          <User
            size={20}
            className="text-[#3046D3]"
          />

          <h2 className="text-xl font-semibold text-gray-900">
            Profile Information
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-5">
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gray-100 bg-[#3046D3] text-4xl font-bold text-white">
              {initial}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:col-span-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="hr-full-name"
                className="text-xs uppercase text-gray-400"
              >
                Full Name
              </label>

              <input
                id="hr-full-name"
                value={fullName}
                onChange={(event) =>
                  handleProfileChange(
                    "full_name",
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border px-4 py-3 focus:border-[#3046D3] focus:outline-none focus:ring-2 focus:ring-[#3046D3]/20"
              />
            </div>

            <div>
              <label
                htmlFor="hr-email"
                className="text-xs uppercase text-gray-400"
              >
                Company Email
              </label>

              <input
                id="hr-email"
                value={
                  profile.email || ""
                }
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="hr-department"
                className="text-xs uppercase text-gray-400"
              >
                Department
              </label>

              <input
                id="hr-department"
                value={departmentName}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="hr-role"
                className="text-xs uppercase text-gray-400"
              >
                Role
              </label>

              <input
                id="hr-role"
                value={roleName}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account Settings */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-7 flex items-center gap-2">
            <CheckCircle2
              size={20}
              className="text-[#3046D3]"
            />

            <h2 className="text-xl font-semibold">
              Account Settings
            </h2>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border p-5">
              <p className="font-medium text-gray-900">
                Authentication
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Single Sign-On with the company account
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl border p-5">
              <div>
                <p className="font-medium text-gray-900">
                  Account Status
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Current database account status
                </p>
              </div>

              <span className="font-semibold text-[#3046D3]">
                {accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-7 flex items-center gap-2">
            <ShieldCheck
              size={20}
              className="text-[#3046D3]"
            />

            <h2 className="text-xl font-semibold">
              Security
            </h2>
          </div>

          <p className="text-gray-500">
            Access is protected by company SSO and role-based access control.
          </p>

          <div className="my-6 border-t" />

          <p className="text-xs uppercase text-gray-400">
            Role
          </p>

          <p className="mt-2 font-semibold text-gray-900">
            {roleName}
          </p>

          <p className="mt-6 text-xs uppercase text-gray-400">
            Account Email
          </p>

          <p className="mt-2 break-all font-semibold text-gray-900">
            {profile.email || "-"}
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-7 flex items-center gap-2">
          <Bell
            size={20}
            className="text-[#3046D3]"
          />

          <h2 className="text-xl font-semibold">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-5">
          <NotificationToggle
            title="Course Notifications"
            description="Receive updates about courses and training programs."
            checked={
              profile.notify_course
            }
            disabled={saving}
            onChange={(value) =>
              handleNotificationChange(
                "notify_course",
                value
              )
            }
          />

          <NotificationToggle
            title="Deadline Reminders"
            description="Receive reminders about course and training deadlines."
            checked={
              profile.notify_deadline
            }
            disabled={saving}
            onChange={(value) =>
              handleNotificationChange(
                "notify_deadline",
                value
              )
            }
          />

          <NotificationToggle
            title="Certificate Notifications"
            description="Receive updates when certificates are issued."
            checked={
              profile.notify_certificate
            }
            disabled={saving}
            onChange={(value) =>
              handleNotificationChange(
                "notify_certificate",
                value
              )
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 disabled:opacity-50"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#3046D3] px-7 py-3 font-medium text-white hover:bg-[#253B80] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border p-5">
      <div>
        <p className="font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#3046D3]"
            : "bg-gray-300"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}