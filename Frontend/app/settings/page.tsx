"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

/** Settings page: Profile, Account Security, and About sections. */
export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState("yasir@email.com");
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordMessage("New password must be at least 4 characters.");
      return;
    }
    setPasswordMessage("Password updated successfully (demo only).");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your profile and account">
      <div className="animate-page-enter mx-auto max-w-2xl space-y-8">
        {/* Profile Settings */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Profile Settings
          </h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Users can manage their basic information.
          </p>
          <hr className="mb-5 border-slate-200 dark:border-slate-600" />
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="e.g. Yasir Ali"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="yasir@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Profile picture
              </label>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-800">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6a2 2 0 11-4 0 2 2 0 014 0zM4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                >
                  Upload Profile Image
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary">
              {profileSaved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Account Security */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Account Security
          </h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Basic security options.
          </p>
          <hr className="mb-5 border-slate-200 dark:border-slate-600" />
          <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            Change Password
          </p>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.includes("success") ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>
                {passwordMessage}
              </p>
            )}
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </section>

        {/* About / App Info */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            About / App Info
          </h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Simple section showing app info.
          </p>
          <hr className="mb-5 border-slate-200 dark:border-slate-600" />
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-medium">AI Dashboard v1.0</p>
            <p>Built with React + Node.js</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
