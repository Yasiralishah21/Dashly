/**
 * List of task categories we show in dropdowns and badges.
 * Each has an id (for saving), label (for display), and emoji.
 */
export const TASK_CATEGORIES = [
  { id: "work", label: "Work", emoji: "💻" },
  { id: "study", label: "Study", emoji: "📚" },
  { id: "health", label: "Health", emoji: "🏋️" },
  { id: "learning", label: "Learning", emoji: "🧠" },
] as const;

export type TaskCategoryId = (typeof TASK_CATEGORIES)[number]["id"];

/** Find one category by id; returns null if not found. */
export function getCategoryById(id: string | undefined) {
  if (!id) return null;
  return TASK_CATEGORIES.find((cat) => cat.id === id) ?? null;
}
