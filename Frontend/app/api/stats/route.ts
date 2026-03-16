import { NextResponse } from "next/server";
import { tasksStore } from "@/lib/tasksStore";

/**
 * Returns task statistics for dashboard and resume-style metrics.
 * Use in production with real analytics for measurable KPIs.
 */
export async function GET() {
  const completed = tasksStore.filter((t) => t.completed).length;
  const pending = tasksStore.filter((t) => !t.completed).length;
  return NextResponse.json({
    tasksTotal: tasksStore.length,
    tasksCompleted: completed,
    tasksPending: pending,
    completionRate: tasksStore.length > 0 ? Math.round((completed / tasksStore.length) * 100) : 0,
  });
}
