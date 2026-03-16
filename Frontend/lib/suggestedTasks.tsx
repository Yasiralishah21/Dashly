/**
 * Common daily tasks users can click to add quickly.
 */
// export const SUGGESTED_DAILY_TASKS = [
//   "Check emails",
//   "Exercise",
//   "Read for 15 min",
//   "Plan tomorrow",
//   "Drink water",
//   "Take a short break",
//   "Review goals",
//   "Meditate",
//   "Clear inbox",
//   "Stand / stretch",
//   "Learn something new",
//   "Call someone",
//   "Write / journal",
//   "Organize workspace",
//   "Review calendar",
// ];

import { useEffect, useState } from "react";

export default function QuickAddTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/suggested-tasks")
      .then((res) => res.json())
      .then((data) => {
        // map to just titles if needed
        setTasks(data.map((t: { title: any; }) => t.title));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {tasks.map((task, index) => (
        <button key={index}>{task}</button>
      ))}
    </div>
  );
}
