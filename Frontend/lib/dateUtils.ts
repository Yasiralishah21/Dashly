/** Format YYYY-MM-DD as "20 March" for display */
export function formatDueDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/** Get today's date as YYYY-MM-DD so we can compare with due dates. */
export function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export type DueCategory = "overdue" | "today" | "upcoming" | null;

/** Figure out if a due date is overdue, due today, upcoming, or missing. */
export function getDueCategory(dueDate: string | undefined): DueCategory {
  if (!dueDate || dueDate.length < 10) return null;
  const today = todayISO();
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

/**
 * Get productivity streak: how many days in a row (including today) the user completed at least one task.
 * completedDates: list of YYYY-MM-DD dates when something was completed.
 */
export function getStreak(completedDates: string[]): number {
  const set = new Set(completedDates);
  const today = todayISO();
  if (!set.has(today)) return 0;

  let count = 0;
  let date = today;
  while (set.has(date)) {
    count++;
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() - 1);
    date = d.toISOString().slice(0, 10);
  }
  return count;
}
