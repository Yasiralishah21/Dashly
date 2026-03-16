"use client";

import { useTasks } from "@/context/TasksContext";
import { useAuth } from "@/context/AuthContext";
import TaskWidget from "@/components/widgets/TaskWidget";
import StatsWidget from "@/components/widgets/StatsWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import NewsWidget from "@/components/widgets/NewsWidget";
import AISuggestionWidget from "@/components/widgets/AISuggestionWidget";

/**
 * Returns greeting based on current hour:
 * Morning: 5 AM – 12 PM, Afternoon: 12 PM – 5 PM, Evening: 5 PM – 10 PM, Night: 10 PM – 5 AM.
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
}

/**
 * Main dashboard view: tasks widget on the left, weather/stats/news on the right.
 * All data comes from TasksContext (tasks and selectedCity). When there are no tasks,
 * TaskWidget shows its own empty message inside the card.
 */
export default function Dashboard() {
  const { tasks, setTasks, toggleTask, selectedCity } = useTasks();
  const { user } = useAuth();
  const userName = user?.name ?? "there";

  return (
    <div className="animate-page-enter flex-1 space-y-6 overflow-x-hidden p-4 sm:p-6 bg-[radial-gradient(circle_at_20%_20%,#c7d2fe,transparent_40%),radial-gradient(circle_at_80%_30%,#e9d5ff,transparent_40%),radial-gradient(circle_at_50%_80%,#ddd6fe,transparent_40%),#f8fafc]">
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {getGreeting()}, {userName}!
        </p>
        <h1 className="mt-1 text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl">
          Dashboard
        </h1>
      </div>
      <AISuggestionWidget tasks={tasks} />
      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TaskWidget tasks={tasks} setTasks={setTasks} toggleTask={toggleTask} />
        </div>
        <div className="space-y-6">
          <WeatherWidget city={selectedCity} />
          <StatsWidget tasks={tasks} />
          <NewsWidget city={selectedCity} />
        </div>
      </div>
    </div>
  );
}
