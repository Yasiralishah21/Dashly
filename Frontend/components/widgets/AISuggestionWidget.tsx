"use client";

import { useMemo } from "react";
import { getDueCategory } from "@/lib/dateUtils";
import type { Task } from "@/types/dashboard";

interface AISuggestionWidgetProps {
  tasks: Task[];
}

/**
 * Suggestion based on user's real task data: total, pending, overdue, due today.
 * Each message is tied to what they actually have.
 */
function getSuggestion(tasks: Task[]): string {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = total - done;
  const overdue = tasks.filter((t) => getDueCategory(t.dueDate) === "overdue").length;
  const dueToday = tasks.filter((t) => getDueCategory(t.dueDate) === "today").length;

  if (total === 0) {
    return "Start your day by planning 3 important tasks.";
  }

  if (pending === 0) {
    return "All done for today! Plan tomorrow's priorities or take a short break.";
  }

  if (pending > 5) {
    return "You have many pending tasks. Focus on completing 2 today.";
  }

  if (overdue > 0) {
    return overdue === 1
      ? "You have 1 overdue task. Review it and finish it first."
      : `You have ${overdue} overdue tasks. Review unfinished tasks and pick one to complete.`;
  }

  if (dueToday >= 2 && pending >= 2) {
    return `You have ${dueToday} tasks due today. Focus on 2 of them first.`;
  }

  if (pending >= 3) {
    return `You have ${pending} pending tasks. Try finishing at least 2 today.`;
  }

  if (pending === 1) {
    return "One task left. Give it your full focus.";
  }

  return "Review unfinished tasks and plan tomorrow's priorities.";
}

/** Small card that shows an AI-style tip based on the current task list. */
export default function AISuggestionWidget({ tasks }: AISuggestionWidgetProps) {
  const message = useMemo(() => getSuggestion(tasks), [tasks]);

  return (
    <div className="card-hover rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 to-white p-4 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-800/80">
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-indigo-800 dark:text-indigo-200">
        <span aria-hidden>🤖</span>
        AI Suggestion
      </p>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {message}
      </p>
    </div>
  );
}
