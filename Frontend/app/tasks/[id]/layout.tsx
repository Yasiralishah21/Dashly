import type { Metadata } from "next";
import { tasksStore } from "@/lib/tasksStore";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const task = tasksStore.find((t) => t.id === id);
  return {
    title: task ? `${task.title} | AI Productivity Dashboard` : "Task | AI Productivity Dashboard",
    description: task?.description ?? "View and manage your task.",
  };
}

export default function TaskIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
