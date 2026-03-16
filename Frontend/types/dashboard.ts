import type { Dispatch, SetStateAction } from "react";

/**
 * Types used across the app for tasks and dashboard flow.
 * Task.id is required so we can toggle tasks correctly when the list order changes.
 */
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  /** Optional: when to do the task or duration, e.g. "9:00 AM", "30 min", "Morning" */
  time?: string;
  /** Optional: deadline date in YYYY-MM-DD */
  dueDate?: string;
  /** Optional: task category id, e.g. "work" | "study" | "health" | "learning" */
  category?: string;
  /** Optional: longer description or notes */
  description?: string;
  /** Optional: priority level */
  priority?: TaskPriority;
  /** Optional: reminder time, e.g. "10:00" or "3pm" */
  reminder?: string;
  /** Date when task was marked done (YYYY-MM-DD). Used for streak. */
  completedAt?: string;
}

export type SetTasksAction = Dispatch<SetStateAction<Task[]>>;

export type DashboardPhase = "prompt" | "input" | "dashboard";
