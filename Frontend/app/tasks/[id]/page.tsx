"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTasks } from "@/context/TasksContext";
import { formatDueDate } from "@/lib/dateUtils";
import { getCategoryById } from "@/lib/categories";
import type { Task as DashboardTask } from "@/types/dashboard";
import { playTaskDoneSound } from "@/lib/taskDoneSound";

type ResolvedTask = DashboardTask & { source: "context" };

/**
 * Task detail page: view and edit a single task. If the task is in TasksContext (from dashboard/tasks page),
 * we edit it there. Otherwise we try to load it from the API (for demo/other sources).
 */
export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { tasks, setTasks, toggleTask } = useTasks();

  const [apiTask, setApiTask] = useState<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const contextTask = tasks.find((t) => t.id === id);
  const taskFromContext: ResolvedTask | null = contextTask
    ? { ...contextTask, source: "context" }
    : null;

  useEffect(() => {
    if (!id) return;
    if (contextTask) {
      setLoading(false);
      return;
    }
    fetch(`/api/tasks/${id}`)
      .then((res) => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then((data) => {
        setApiTask(data);
      })
      .catch(() => setApiTask(null))
      .finally(() => setLoading(false));
  }, [id, contextTask]);

  const task = taskFromContext ?? (apiTask ? { ...apiTask, source: "api" as const } : null);
  const fromContext = task && "source" in task && task.source === "context";

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription("description" in task && task.description ? task.description : "");
    }
  }, [task]);

  const handleSave = () => {
    // Update task in context or via API depending on where it came from.
    if (!task || saving || !title.trim()) return;
    setSaving(true);
    if (fromContext) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: title.trim(), description: description.trim() || undefined } : t))
      );
      setEditing(false);
      setSaving(false);
    } else if (apiTask) {
      fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
      })
        .then((res) => res.ok && res.json())
        .then((data) => data && setApiTask(data))
        .finally(() => {
          setSaving(false);
          setEditing(false);
        });
    }
  };

  const handleToggleComplete = () => {
    // Mark task done/not done in context or via API.
    if (!task || saving) return;
    const currentlyDone = fromContext ? (task as ResolvedTask).done : apiTask?.completed;
    if (!currentlyDone) playTaskDoneSound();
    if (fromContext) {
      toggleTask(id);
    } else if (apiTask) {
      setSaving(true);
      fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !apiTask.completed }),
      })
        .then((res) => res.ok && res.json())
        .then((data) => data && setApiTask(data))
        .finally(() => setSaving(false));
    }
  };

  const handleDelete = () => {
    if (!task || saving || !confirm("Delete this task?")) return;
    // Remove from context or call API, then go back to tasks list.
    if (fromContext) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      router.push("/tasks");
    } else {
      setSaving(true);
      fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
        .then((res) => res.ok && router.push("/tasks"))
        .finally(() => setSaving(false));
    }
  };

  const isDone = fromContext
    ? (task as ResolvedTask).done
    : apiTask?.completed ?? false;

  if (loading) {
    return (
      <DashboardLayout title="Task" subtitle="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout title="Task" subtitle="Not found">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-500 dark:text-slate-400">Task not found.</p>
          <Link href="/tasks" className="mt-4 inline-block text-indigo-600 hover:underline dark:text-indigo-400">
            Back to Tasks
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={task.title} subtitle={isDone ? "Completed" : "In progress"}>
      <div className="animate-page-enter max-w-2xl">
        <Link href="/tasks" className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          ← Back to Tasks
        </Link>
        <div className="card-hover rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {editing ? (
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Title"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Description (optional)"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1
                    className={`text-xl font-semibold ${
                      isDone ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {fromContext && "time" in task && task.time && (
                      <span className="mr-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {task.time}
                      </span>
                    )}
                    {fromContext && "category" in task && task.category && (() => {
                      const cat = getCategoryById(task.category);
                      return cat ? <span className="mr-2 rounded bg-slate-200 px-2 py-0.5 text-sm font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200">[{cat.label}]</span> : null;
                    })()}
                    {task.title}
                  </h1>
                  {fromContext && "dueDate" in task && task.dueDate && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <svg className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {formatDueDate(task.dueDate)}
                    </p>
                  )}
                  {fromContext && "priority" in task && task.priority && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Priority: {task.priority}</p>
                  )}
                  {"description" in task && task.description && (
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{task.description}</p>
                  )}
                </div>
                <span className="shrink-0 rounded px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {isDone ? "Done" : "Pending"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleToggleComplete}
                  disabled={saving}
                  className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
                >
                  {isDone ? "Mark incomplete" : "Mark complete"}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  disabled={saving}
                  className="btn-primary text-sm py-1.5 px-3 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="btn-secondary text-sm py-1.5 px-3 border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/30 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
