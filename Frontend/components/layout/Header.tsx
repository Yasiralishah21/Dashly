"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

/** Top bar: page title, theme toggle, and user name + logout. On mobile, menu button toggles sidebar. */
export default function Header({ title, subtitle }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();
  const isDark = resolvedTheme === "dark";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0 ">
          <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="truncate text-sm text-slate-600 dark:text-slate-400 tracking-widest">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-lg p-2 transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <div className="relative flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
            {user?.name ?? "User"}
          </span>
          <button
            type="button"
            onClick={handleLogoutClick}
            className="btn-secondary px-3 py-1.5 text-sm"
          >
            Log out
          </button>
          {showLogoutConfirm && (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={handleLogoutCancel}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                <p className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                  Are you sure?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleLogoutConfirm}
                    className="btn-primary flex-1 px-3 py-1.5 text-sm"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutCancel}
                    className="btn-secondary flex-1 px-3 py-1.5 text-sm"
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
