"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { DashboardPhase, Task } from "@/types/dashboard";
import { todayISO } from "@/lib/dateUtils";

// What we share with the rest of the app: current step, task list, and city.
interface TasksContextValue {
  phase: DashboardPhase;
  setPhase: (phase: DashboardPhase) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTask: (id: string) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<DashboardPhase>("prompt");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Flip done/not done for one task by id. When marking done, save today's date for streak.
  const toggleTask = useCallback((id: string) => {
    const today = todayISO();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.done) {
          return { ...t, done: false, completedAt: undefined };
        }
        return { ...t, done: true, completedAt: today };
      })
    );
  }, []);

  const value: TasksContextValue = {
    phase,
    setPhase,
    tasks,
    setTasks,
    toggleTask,
    selectedCity,
    setSelectedCity,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
