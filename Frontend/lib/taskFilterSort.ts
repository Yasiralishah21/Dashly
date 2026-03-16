import type { Task } from "@/types/dashboard";

/** Filter: show all tasks, only completed, or only pending. */
export type TaskFilter = "all" | "completed" | "pending";
/** Sort: by due date (earliest first) or by recently added (newest first). */
export type TaskSort = "due-date" | "recently-added";

function passesFilter(task: Task, filter: TaskFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "completed":
      return task.done;
    case "pending":
      return !task.done;
    default:
      return true;
  }
}

/**
 * Returns tasks filtered and sorted. For "recently-added" we use each task's index in the original array.
 */
export function getFilteredAndSortedTasks(
  tasks: Task[],
  filter: TaskFilter,
  sort: TaskSort
): Task[] {
  const withIndex = tasks.map((task, index) => ({ task, index }));
  const filtered = withIndex.filter(({ task }) => passesFilter(task, filter));

  if (sort === "recently-added") {
    filtered.sort((a, b) => b.index - a.index);
  } else if (sort === "due-date") {
    filtered.sort((a, b) => {
      const dateA = a.task.dueDate ?? "\uFFFF";
      const dateB = b.task.dueDate ?? "\uFFFF";
      return dateA.localeCompare(dateB);
    });
  }

  return filtered.map(({ task }) => task);
}
