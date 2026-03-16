"use client";

import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDueDate, getDueCategory, todayISO } from "@/lib/dateUtils";
import { getCategoryById, TASK_CATEGORIES } from "@/lib/categories";
import { getFilteredAndSortedTasks, type TaskFilter, type TaskSort } from "@/lib/taskFilterSort";
import type { Task } from "@/types/dashboard";
import type { SetTasksAction } from "@/types/dashboard";
import { playTaskDoneSound } from "@/lib/taskDoneSound";
import Celebration from "@/components/Celebration";

// Move item in array from fromIndex to toIndex. Used after drag.
function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const copy = [...list];
  const [removed] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, removed);
  return copy;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS: { value: TaskSort; label: string }[] = [
  { value: "due-date", label: "Due Date" },
  { value: "recently-added", label: "Recently Added" },
];

interface TaskWidgetProps {
  tasks: Task[];
  setTasks: SetTasksAction;
  toggleTask: (id: string) => void;
}

// Drag handle icon (☰) for reordering.
function DragHandle() {
  return (
    <span className="flex cursor-grab touch-none items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-hidden>
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 6h2v2H8V6zm0 5h2v2H8v-2zm0 5h2v2H8v-2zm5-10h2v2h-2V6zm0 5h2v2h-2v-2zm0 5h2v2h-2v-2z" />
      </svg>
    </span>
  );
}

// One task row: checkbox, title, and optional time/due/category (no drag).
function TaskRow({
  task,
  toggleTask,
  onMarkDone,
}: {
  task: Task;
  toggleTask: (id: string) => void;
  onMarkDone?: () => void;
}) {
  const categoryInfo = task.category ? getCategoryById(task.category) : null;
  const hasTimeOrDueOrCategory = task.time || task.dueDate || categoryInfo;

  const handleClick = () => {
    if (!task.done) onMarkDone?.();
    toggleTask(task.id);
  };

  return (
    <li className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-slate-600/50 dark:bg-slate-800/40">
      <button
        type="button"
        onClick={handleClick}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black transition hover:border-indigo-500 dark:border-slate-200 dark:hover:border-indigo-500"
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {/* Checkmark animates in/out with fade + scale when task is toggled */}
        <span className={`task-check-mark inline-flex items-center justify-center ${task.done ? "task-done" : "task-pending"}`}>
          {task.done && (
            <svg className="h-3 w-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className={`text-[15px] font-medium leading-snug ${task.done ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
          {task.title}
        </p>
        {hasTimeOrDueOrCategory && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {task.time && (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {task.time}
              </span>
            )}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due {formatDueDate(task.dueDate)}
              </span>
            )}
            {categoryInfo && (
              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-600/80 dark:text-slate-300">
                {categoryInfo.emoji} {categoryInfo.label}
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

// Same as TaskRow but draggable: has a handle (☰) and useSortable.
function SortableTaskRow({
  task,
  toggleTask,
  onMarkDone,
}: {
  task: Task;
  toggleTask: (id: string) => void;
  onMarkDone?: () => void;
}) {
  const categoryInfo = task.category ? getCategoryById(task.category) : null;
  const hasTimeOrDueOrCategory = task.time || task.dueDate || categoryInfo;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleClick = () => {
    if (!task.done) onMarkDone?.();
    toggleTask(task.id);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-slate-600/50 dark:bg-slate-800/40 ${isDragging ? "opacity-80 shadow-md" : ""}`}
    >
      <div {...attributes} {...listeners} className="shrink-0 cursor-grab active:cursor-grabbing" aria-label="Drag to reorder">
        <DragHandle />
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black transition hover:border-indigo-500 dark:border-slate-200 dark:hover:border-indigo-500"
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        <span className={`task-check-mark inline-flex items-center justify-center ${task.done ? "task-done" : "task-pending"}`}>
          {task.done && (
            <svg className="h-3 w-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className={`text-[15px] font-medium leading-snug ${task.done ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
          {task.title}
        </p>
        {hasTimeOrDueOrCategory && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {task.time && (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {task.time}
              </span>
            )}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due {formatDueDate(task.dueDate)}
              </span>
            )}
            {categoryInfo && (
              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-600/80 dark:text-slate-300">
                {categoryInfo.emoji} {categoryInfo.label}
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

// A section with a title and a list of tasks (Overdue, Due today, etc.).
function TaskSection({ title, items, toggleTask }: { title: string; items: Task[]; toggleTask: (id: string) => void }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h4 className="mb-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h4>
      <ul className="space-y-3">
        {items.map((task) => (
          <TaskRow key={task.id} task={task} toggleTask={toggleTask} />
        ))}
      </ul>
    </section>
  );
}

/**
 * Tasks card on the dashboard: filter, sort, add form, and tasks grouped by due date.
 * When there are no tasks we show a short message; otherwise we show Overdue / Due today / Upcoming / No deadline.
 */
export default function TaskWidget({
  tasks,
  setTasks,
  toggleTask,
}: TaskWidgetProps) {
  const [seed, setSeed] = useState(0);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [sort, setSort] = useState<TaskSort>("due-date");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const hasIncomplete = tasks.some((t) => !t.done);
  const hasComplete = tasks.some((t) => t.done);
  const markAllDone = () => {
    const today = todayISO();
    setTasks((prev) => prev.map((t) => ({ ...t, done: true, completedAt: today })));
  };
  const markAllUndone = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, done: false })));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, done: false, dueDate: newDue.trim() || undefined, category: newCategory.trim() || undefined },
    ]);
    setNewTitle("");
    setNewDue("");
  };

  const filteredSorted = useMemo(
    () => getFilteredAndSortedTasks(tasks, filter, sort),
    [tasks, filter, sort]
  );

  const groupedTasks = useMemo(() => {
    const overdue = filteredSorted.filter((task) => getDueCategory(task.dueDate) === "overdue");
    const dueToday = filteredSorted.filter((task) => getDueCategory(task.dueDate) === "today");
    const upcoming = filteredSorted.filter((task) => getDueCategory(task.dueDate) === "upcoming");
    const noDate = filteredSorted.filter((task) => getDueCategory(task.dueDate) === null);
    return { overdue, dueToday, upcoming, noDate };
  }, [filteredSorted]);

  const hasFilteredTasks =
    groupedTasks.overdue.length + groupedTasks.dueToday.length + groupedTasks.upcoming.length + groupedTasks.noDate.length > 0;

  const [actionsOpen, setActionsOpen] = useState(false);
  // Increment this to show celebration + play sound when a task is marked done (not when unmarked).
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);

  const handleTaskMarkedDone = () => {
    playTaskDoneSound();
    setCelebrationTrigger((t) => t + 1);
  };

  // When user finishes dragging: reorder the visible list and update full tasks array.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = filteredSorted.findIndex((t) => t.id === active.id);
    const toIndex = filteredSorted.findIndex((t) => t.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    const reordered = reorderList(filteredSorted, fromIndex, toIndex);
    const indices = filteredSorted.map((t) => tasks.findIndex((x) => x.id === t.id));
    const newTasks = [...tasks];
    indices.forEach((idx, i) => {
      newTasks[idx] = reordered[i];
    });
    setTasks(newTasks);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  return (
    <div className="card-hover rounded-xl bg-gradient-to-r from-violet-950 to-violet-100  border-2 border-slate-400 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <Celebration key={celebrationTrigger} trigger={celebrationTrigger} />
      {/* Header: title on left, actions menu + Add task on right */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 
        className="text-3xl font-bold text-amber-50 dark:text-slate-100 tracking-widest">
          Tasks
        </h3>
        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setActionsOpen((o) => !o)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                aria-label="Task actions"
                aria-expanded={actionsOpen}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {actionsOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setActionsOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => { markAllDone(); setActionsOpen(false); }}
                      disabled={!hasIncomplete}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 disabled:opacity-50 dark:text-slate-300"
                    >
                      Mark all done
                    </button>
                    <button
                      type="button"
                      onClick={() => { markAllUndone(); setActionsOpen(false); }}
                      disabled={!hasComplete}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 disabled:opacity-50 dark:text-slate-300"
                    >
                      Mark all undone
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSeed((s) => s + 1); setActionsOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300"
                    >
                      Shuffle order
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="btn-primary flex items-center gap-2"
          >
            <span className="flex h-5 w-5 items-center justify-center text-lg font-bold leading-none">+</span>
            {showAddForm ? "Cancel" : "Add task"}
          </button>
        </div>
      </div>

      {/* Add task form: only when open */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/40">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Category</option>
              {TASK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
            <button type="submit" disabled={!newTitle.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
              Add
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="rounded-xl bg-slate-50/80 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
          No tasks yet. Click <strong>Add task</strong> above to add one.
        </p>
      ) : (
        <>
          {/* Filter + Sort in one compact row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50/80 px-3 py-2 dark:bg-slate-800/30">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Show</span>
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    filter === f.value
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="mx-1 text-slate-300 dark:text-slate-600">|</span>
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as TaskSort)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-6">
            {!hasFilteredTasks ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/30 dark:text-slate-400">
                No tasks match this filter. Try another.
              </p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredSorted.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-3 list-none">
                    {filteredSorted.map((task, i) => {
                      const cat = getDueCategory(task.dueDate);
                      const prevCat = i === 0 ? null : getDueCategory(filteredSorted[i - 1].dueDate);
                      const showHeader = cat !== prevCat;
                      const sectionTitle =
                        cat === "overdue" ? "Overdue" : cat === "today" ? "Due today" : cat === "upcoming" ? "Upcoming" : "No deadline";
                      const headerClass =
                        cat === "overdue"
                          ? "mb-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400"
                          : cat === null
                            ? "mb-2.5 text-sm font-medium text-slate-500 dark:text-slate-400"
                            : "mb-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300";
                      return (
                        <React.Fragment key={task.id}>
                          {showHeader && (
                            <li className="list-none ">
                              <h4 className={`headerClass, "border-2 border-black"1`}>{sectionTitle}</h4>
                            </li>
                          )}
                          <SortableTaskRow task={task} toggleTask={toggleTask} onMarkDone={handleTaskMarkedDone} />
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </>
      )}
    </div>
  );
}
