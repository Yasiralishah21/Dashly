"use client";

import type { Task } from "@/types/dashboard";
import { getStreak } from "@/lib/dateUtils";

interface StatsWidgetProps {
  tasks: Task[];
}

/**
 * StatsWidget: Shows completed vs total and productivity streak.
 * Updates when tasks or done state change (synced from Sidebar or TaskWidget checkboxes).
 */
export default function StatsWidget({ tasks }: StatsWidgetProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;

  // Get dates when at least one task was completed (use completedAt when task is done).
  const completedDates = tasks
    .filter((t) => t.done && t.completedAt)
    .map((t) => t.completedAt as string);
  const uniqueDates = [...new Set(completedDates)];
  const streak = getStreak(uniqueDates);

  if (total === 0) {
    return (
      <div className="card-hover Ready rounded-xl border border-slate-400 p-5 shadow-sm dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900/50">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Task stats
        </h3>
        <div className="flex flex-col items-center py-2 text-center">
          <span className="text-3xl">📊</span>
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Ready when you are
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Complete tasks to see your progress here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-hover rounded-xl border border-slate-200 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Task stats
      </h3>
      {streak > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50/80 p-3 dark:border-amber-800/50 dark:bg-amber-900/20">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-200">
            <span>🔥</span> {streak} Day Productivity Streak
          </p>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
            You completed tasks {streak} days in a row!
          </p>
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {completed}
        </span>
        <span className="text-slate-500 dark:text-slate-400">/</span>
        <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {total}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          completed
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {Math.round((completed / total) * 100)}% done
      </p>
    </div>
  );
}
