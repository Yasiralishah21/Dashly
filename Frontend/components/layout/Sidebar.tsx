"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useTasks } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { formatDueDate } from "@/lib/dateUtils";
import { getCategoryById } from "@/lib/categories";
import { playTaskDoneSound } from "@/lib/taskDoneSound";

// Links shown in the sidebar. Same tasks as Dashboard and /tasks (from TasksContext).
const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    href: "/tasks",
    label: "Add a task",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    href: "/stats",
    label: "Stats",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

/** Left sidebar: logo, nav links (Dashboard, Add a task, Stats), and a list of tasks with checkboxes. */
export default function Sidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { phase, tasks, toggleTask } = useTasks();
  const { setTheme, resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const isDark = resolvedTheme === "dark";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  // On mobile, close the sidebar when the user navigates to a new page.
  useEffect(() => setOpen(false), [pathname, setOpen]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo / brand */}
        <div className="flex border border-slate-200 h-16 items-center px-6 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"
          >
            <span 
              className="flex border border-slate-200 h-8 w-16 items-center justify-center rounded-lg bg-indigo-600 text-white"
              style={{
                background: `
                  radial-gradient(circle at 10% 90%,rgb(0, 14, 71) 0%, transparent 45%),
                  radial-gradient(circle at 90% 90%,rgb(39, 0, 80) 0%, transparent 55%),
                  radial-gradient(circle at 50% 90%,rgb(21, 0, 112) 0%, transparent 65%),
                  #f1f5f9
                `
              }}
            >
              YasAI
            </span>
            <span className="text-lg">Productivity</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-md font-medium transition-colors ${
                  isActive
                    ? "bg-purple-100 text-black-700 text-xl hover:bg-purple-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-slate-500 hover:bg-slate-100 hover:scale-105 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
                {item.label}
              </Link>
            );
          })}

          {/* Task section: same tasks as Dashboard and /tasks page; empty state when no tasks */}
          {(phase === "dashboard" || tasks.length > 0) && (
            <>
              <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                My tasks
              </p>
              {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-3 py-4 text-center dark:border-slate-600 dark:bg-slate-800/30">
                  <span className="text-2xl">📋</span>
                  <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                    No tasks yet
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-500">
                    Add some on Dashboard
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {tasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 rounded-lg px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!t.done) playTaskDoneSound();
                          toggleTask(t.id);
                        }}
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-black transition hover:border-indigo-500 dark:border-slate-200"
                        aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                      >
                        {t.done && (
                          <svg
                            className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <span className="min-w-0 flex-1 flex items-start gap-1.5">
                        <div className="flex flex-col gap-0.5 shrink-0">
                          {t.time && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {t.time}
                            </span>
                          )}
                          {t.dueDate && (
                            <p className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Due: {formatDueDate(t.dueDate)}
                            </p>
                          )}
                        </div>
                        <span className={`min-w-0 truncate text-sm ${t.done ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-white"}`} title={[t.time, t.category ? getCategoryById(t.category)?.label : null, t.title, t.dueDate ? `Due: ${formatDueDate(t.dueDate)}` : ""].filter(Boolean).join(" · ")}>
                          {t.category && (() => {
                            const cat = getCategoryById(t.category);
                            return cat ? <span className="shrink-0 rounded bg-slate-200 px-1 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200">[{cat.label}]</span> : null;
                          })()}
                          {t.title}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </nav>

        {/* Settings at bottom: theme, logout */}
        <div className="border-t border-slate-200 p-4 space-y-1 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-md font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="h-5 w-5 shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 shrink-0 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-md font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
            {showLogoutConfirm && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden
                  onClick={handleLogoutCancel}
                />
                <div className="absolute left-0 bottom-full z-50 mb-2 w-56 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-600 dark:bg-slate-800">
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
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-md font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
