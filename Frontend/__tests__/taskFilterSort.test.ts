import { getFilteredAndSortedTasks } from "../lib/taskFilterSort";

test("filters completed tasks", () => {
  const tasks = [
    { id: "1", title: "Task 1", done: true },
    { id: "2", title: "Task 2", done: false },
  ];

  const result = getFilteredAndSortedTasks(tasks, "completed", "due-date");

  expect(result.length).toBe(1);
});