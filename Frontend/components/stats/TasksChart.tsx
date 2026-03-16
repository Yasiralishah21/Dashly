"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTasks } from "@/context/TasksContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const EMPTY_ILLUSTRATION =
  "https://illustrations.popsy.co/gray/designer.svg";

// Day names for the week (Sun = 0, Mon = 1, ...).
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Build weekly data: last 7 days, how many tasks were completed on each day.
 * Uses task.completedAt (YYYY-MM-DD) for completed tasks.
 */
function getWeeklyData(tasks: { done: boolean; completedAt?: string }[]) {
  const result: { day: string; completed: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = DAY_NAMES[d.getDay()];
    const count = tasks.filter(
      (t) => t.done && t.completedAt === dateStr
    ).length;
    result.push({ day: dayName, completed: count });
  }

  return result;
}

export default function TasksChart() {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-10 text-center shadow-sm dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900/50">
        <div className="flex justify-center">
          <img
            src={EMPTY_ILLUSTRATION}
            alt="No data yet"
            className="h-28 w-28 object-contain sm:h-32 sm:w-32"
            width={128}
            height={128}
          />
        </div>
        <h3 className="mt-4 font-semibold text-slate-800 dark:text-slate-100">
          No tasks to show yet
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Add tasks on the Dashboard or Tasks page — your weekly productivity
          chart will appear here.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  const weekData = getWeeklyData(tasks);
  const labels = weekData.map((row) => row.day);
  const completedCounts = weekData.map((row) => row.completed);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Tasks completed",
        data: completedCounts,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    // Bar animation on load: 0.5s duration for a smooth entrance.
    animation: {
      duration: 500,
    },
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.parsed.y} tasks`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Weekly Productivity
      </h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Tasks completed per day (last 7 days)
      </p>
      <div className="chart-container" style={{ minHeight: "260px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
        {weekData.map((row) => (
          <span key={row.day}>
            {row.day}: <strong>{row.completed}</strong> tasks
          </span>
        ))}
      </div>
    </div>
  );
}
