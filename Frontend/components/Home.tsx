"use client";

import { useRef, useState, useEffect } from "react";
import { useTasks } from "@/context/TasksContext";
import { useAuth } from "@/context/AuthContext";
import type { Task } from "@/types/dashboard";
import QuickAddMarquee from "@/components/QuickAddMarquee";
import { formatDueDate } from "@/lib/dateUtils";
import { TASK_CATEGORIES, getCategoryById } from "@/lib/categories";
import Dashboard from "./Dashboard";

// Cities we suggest in the dropdown; user can also type any city.
const CITY_OPTIONS = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Berlin",
  "Toronto",
  "Karachi",
  "Mumbai",
  "Dubai",
  "Singapore",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
];

/**
 * Home is the main entry after login. It has 3 steps:
 * 1. Prompt — Ask "Do you want AI task suggestions?" (Yes/No) and city on the same screen.
 * 2. Input — If Yes, user adds tasks; then they click Done to go to dashboard.
 * 3. Dashboard — If No, we go here after city. If Yes, we go here after city + optional tasks.
 */
export default function Home() {
  const { phase, setPhase, tasks, setTasks, setSelectedCity } = useTasks();
  const { user } = useAuth();
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);

  // After sign in, show add-task screen first (skip prompt).
  useEffect(() => {
    if (user && phase === "prompt") setPhase("input");
  }, [user, phase, setPhase]);

  // Form state for adding a task (used in step 2).
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const taskInputRef = useRef<HTMLInputElement>(null);

  // City and AI choice (used in step 1).
  const [cityInput, setCityInput] = useState("");
  const [citySubmitError, setCitySubmitError] = useState<string | null>(null);
  // null = not chosen yet; "yes" = go to task input after city; "no" = go to dashboard after city.
  const [aiChoice, setAiChoice] = useState<"yes" | "no" | null>(null);
  // Last clicked quick-add chip title, used for pulse animation (cleared after 500ms).
  const [selectedChipTitle, setSelectedChipTitle] = useState<string | null>(null);


  useEffect(() => {
  if (phase === "input") {
    fetch("http://localhost:5000/suggested-tasks")
      .then(res => res.json())
      .then(data => setSuggestedTasks(data.map((t: {title: string}) => t.title)))
      .catch(err => console.error("Failed to load suggested tasks", err));
  }
}, [phase]);

  // ——— Step 1: Prompt screen (Yes/No + city) ———
  // if (phase === "prompt") {
  //   const handleCitySubmit = async () => {
  //     const city = cityInput.trim();
  //     if (!city) {
  //       setCitySubmitError("Please enter or select a city.");
  //       return;
  //     }
  //     setCitySubmitError(null);
  //     try {
  //       const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  //       if (!res.ok) {
  //         const err = await res.json().catch(() => ({}));
  //         setCitySubmitError(err?.error ?? "Could not find weather for this city. Try another.");
  //         return;
  //       }
  //       setSelectedCity(city);
  //       if (aiChoice === "yes") setPhase("input");
  //       else setPhase("dashboard");
  //     } catch {
  //       setCitySubmitError("Failed to verify city. Try again.");
  //     }
  //   };

  //   return (
  //     <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12">
  //       <h1 className="text-center text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
  //         Do you want AI task suggestions?
  //       </h1>
  //       <div className="flex gap-4">
  //         <button
  //           type="button"
  //           onClick={() => setAiChoice("yes")}
  //           className={`btn-primary ${aiChoice === "yes" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}
  //         >
  //           Yes
  //         </button>
  //         <button
  //           type="button"
  //           onClick={() => setAiChoice("no")}
  //           className={`btn-secondary ${aiChoice === "no" ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}
  //         >
  //           No
  //         </button>
  //       </div>

  //       <div className="mt-2 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/50">
  //         <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
  //           Your city (for weather and news)
  //         </p>
  //         <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  //           <input
  //             id="prompt-city-input"
  //             list="prompt-city-list"
  //             type="text"
  //             value={cityInput}
  //             onChange={(e) => {
  //               setCityInput(e.target.value);
  //               setCitySubmitError(null);
  //             }}
  //             onKeyDown={(e) => e.key === "Enter" && handleCitySubmit()}
  //             placeholder="Select or type a city"
  //             className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
  //           />
  //           <datalist id="prompt-city-list">
  //             {CITY_OPTIONS.map((cityName) => (
  //               <option key={cityName} value={cityName} />
  //             ))}
  //           </datalist>
  //           <button
  //             type="button"
  //             onClick={handleCitySubmit}
  //             disabled={!aiChoice}
  //             className="btn-primary shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
  //           >
  //             {aiChoice === "yes" ? "Continue to tasks" : aiChoice === "no" ? "Go to dashboard" : "Continue"}
  //           </button>
  //         </div>
  //         {citySubmitError && (
  //           <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
  //             {citySubmitError}
  //           </p>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // ——— Step 2: Task input (only when user chose Yes and submitted city) ———
  if (phase === "input") {
    const addTask = () => {
      const title = newTaskTitle.trim();
      if (!title) return;
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        done: false,
        time: newTaskTime.trim() || undefined,
        dueDate: newTaskDue.trim() || undefined,
        category: newTaskCategory.trim() || undefined,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
      setNewTaskTime("");
      setNewTaskDue("");
    };

    const handleQuickAddSelect = (title: string) => {
      setSelectedChipTitle(title);
      setNewTaskTitle(title);
      taskInputRef.current?.focus();
      setTimeout(() => setSelectedChipTitle(null), 500);
    };

    return (
      <div className="flex min-h-[60vh] flex-col items-center gap-6 px-4 py-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          E nter your daily tasks
        </h2>
        <div className="w-full max-w-md space-y-3">
          <div className="flex gap-2">
            <input
              ref={taskInputRef}
              type="text"
              value={newTaskTitle}
              placeholder="Add a task..."
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 min-w-0 rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={addTask}
              className="btn-primary shrink-0"
            >
              Add
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="task-time" className="text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">
              When / duration
            </label>
            <input
              id="task-time"
              type="text"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="e.g. 9:00 AM, 30 min"
              className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="task-due" className="text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="task-category" className="text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">
              Category
            </label>
            <select
              id="task-category"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">None</option>
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full max-w-md">
          <QuickAddMarquee
            tasks={suggestedTasks}       // fetched from backend
            isAdded={(title) => tasks.some((t) => t.title === title)}
            onSelect={handleQuickAddSelect}
            selectedTitle={selectedChipTitle}
          />
        </div>
        <ul className="w-full max-w-md space-y-2">
          {tasks.map((t) => {
            const categoryInfo = t.category ? getCategoryById(t.category) : null;
            return (
              <li
                key={t.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800"
              >
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 shrink-0">
                    {t.time && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.time}
                      </span>
                    )}
                    {t.dueDate && (
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <svg className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {formatDueDate(t.dueDate)}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-900 dark:text-white">
                    {categoryInfo && (
                      <span className="mr-1.5 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200">
                        [{categoryInfo.label}]
                      </span>
                    )}
                    {t.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setPhase("dashboard")}
          disabled={tasks.length < 1}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {tasks.length > 0 ? "Done — Go to dashboard" : "Add at least 1 task to continue"}
        </button>
      </div>
    );
  }

  // ——— Step 3: Dashboard (after No, or after city + optional tasks and Done) ———
  return <Dashboard />;
}
