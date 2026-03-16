"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuickAddMarquee from "@/components/QuickAddMarquee";
import Celebration from "@/components/Celebration";
import { useTasks } from "@/context/TasksContext";
import { getFilteredAndSortedTasks, type TaskFilter, type TaskSort } from "@/lib/taskFilterSort";
import { getDueCategory } from "@/lib/dateUtils";
import { TASK_CATEGORIES, getCategoryById } from "@/lib/categories";
import { playTaskDoneSound } from "@/lib/taskDoneSound";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/dashboard";

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS: { value: TaskSort; label: string }[] = [
  { value: "due-date", label: "Due Date" },
  { value: "recently-added", label: "Recently Added" },
];

// Drag handle icon
function DragHandle() {
  return (
    <span className="flex cursor-grab items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 6h2v2H8V6zm0 5h2v2H8v-2zm0 5h2v2H8v-2zm5-10h2v2h-2V6zm0 5h2v2h-2v-2zm0 5h2v2h-2v-2z" />
      </svg>
    </span>
  );
}

// One sortable task row
function SortableTaskRow({ task, toggleTask, onMarkDone }: {
  task: Task;
  toggleTask: (id: string) => void;
  onMarkDone?: () => void;
}) {
  const categoryInfo = task.category ? getCategoryById(task.category) : null;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const handleClick = () => { if (!task.done) onMarkDone?.(); toggleTask(task.id); };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50 ${isDragging ? "opacity-80 shadow-lg" : ""}`}
    >
      <div {...attributes} {...listeners} className="shrink-0 cursor-grab" aria-label="Drag to reorder">
        <DragHandle />
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black hover:border-indigo-500 dark:border-slate-200"
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        <span className={`inline-flex items-center justify-center ${task.done ? "task-done" : "task-pending"}`}>
          {task.done && (
            <svg className="h-3 w-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          )}
        </span>
      </button>
      <div className="flex-1 min-w-0 flex flex-col gap-0">
        <div className="flex items-start gap-2">
          {categoryInfo && (
            <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200">
              [{categoryInfo.label}]
            </span>
          )}
          <Link href={`/tasks/${task.id}`} className={`${task.done ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-white"} hover:underline`}>
            {task.title}
          </Link>
        </div>
      </div>
      <span className="text-xs text-slate-400 dark:text-slate-500">{task.done ? "Done" : "Pending"}</span>
    </li>
  );
}

// Move item in array
function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const copy = [...list];
  const [removed] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, removed);
  return copy;
}

export default function TasksPage() {
  const { tasks, setTasks, toggleTask } = useTasks();
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChipTitle, setSelectedChipTitle] = useState<string | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const taskInputRef = useRef<HTMLInputElement>(null);

  const filteredSortedTasks = getFilteredAndSortedTasks(tasks, "all", "due-date"); // adjust filters if needed
  const hasFilteredResults = filteredSortedTasks.length > 0;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/suggested-tasks")
      .then((res) => res.json())
      .then((data) => setSuggestedTasks(data.map((t: { title: string }) => t.title)))
      .catch(console.error);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || adding) return;
    setAdding(true);
    setTasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), title, done: false, time: newTime || undefined, dueDate: newDue || undefined, category: newCategory || undefined },
    ]);
    setNewTitle(""); setNewTime(""); setNewDue(""); setNewCategory("");
    setAdding(false);
  };

  const handleQuickAddSelect = (title: string) => {
    setSelectedChipTitle(title);
    setNewTitle(title);
    setShowAddForm(true);
    taskInputRef.current?.focus();
    setTimeout(() => setSelectedChipTitle(null), 500);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = filteredSortedTasks.findIndex(t => t.id === active.id);
    const toIndex = filteredSortedTasks.findIndex(t => t.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    const reordered = reorderList(filteredSortedTasks, fromIndex, toIndex);
    const indices = filteredSortedTasks.map(t => tasks.findIndex(x => x.id === t.id));
    const newTasks = [...tasks];
    indices.forEach((idx, i) => { newTasks[idx] = reordered[i]; });
    setTasks(newTasks);
  };

  const handleTaskMarkedDone = () => { playTaskDoneSound(); setCelebrationTrigger(t => t + 1); };

  return (
    <DashboardLayout title="Tasks" subtitle="Manage your to-do list">
      <Celebration key={celebrationTrigger} trigger={celebrationTrigger} />
      <div className="space-y-6">
        <button type="button" onClick={() => setShowAddForm(v => !v)} className="btn-primary flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center text-lg font-bold">+</span>
          {showAddForm ? "Hide form" : "Add task"}
        </button>

        {showAddForm && (
          <form onSubmit={handleAdd} className="space-y-2 rounded-lg border p-4 dark:border-slate-700">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={taskInputRef} value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="Task name" className="flex-1 rounded-lg border px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button type="submit" disabled={adding || !newTitle.trim()} className="btn-primary">
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="When (optional)" className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="">Category</option>
                {TASK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </form>
        )}

        <QuickAddMarquee
          tasks={suggestedTasks}
          onSelect={handleQuickAddSelect}
          selectedTitle={selectedChipTitle}
          isAdded={(title) => tasks.some(t => t.title === title)}
        />

        {filteredSortedTasks.length === 0 ? (
          <div className="rounded-xl border p-12 text-center dark:border-slate-700">
            <p className="text-4xl mb-4">✨</p>
            <h3 className="font-semibold mb-2">No tasks yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add a task above or go to the dashboard to get started.</p>
            <Link href="/" className="btn-primary px-4 py-2 text-sm">Go to Dashboard</Link>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredSortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2 list-none">
                {filteredSortedTasks.map((task, i) => <SortableTaskRow key={task.id} task={task} toggleTask={toggleTask} onMarkDone={handleTaskMarkedDone} />)}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </DashboardLayout>
  );
}
