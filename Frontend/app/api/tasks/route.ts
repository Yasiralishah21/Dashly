import { NextResponse } from "next/server";
import { tasksStore } from "@/lib/tasksStore";
import type { Task } from "@/types";

export async function GET() {
  return NextResponse.json(tasksStore);
}

const VALID_PRIORITIES = ["low", "medium", "high"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority = "medium" } = body;
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const p = VALID_PRIORITIES.includes(priority) ? priority : "medium";
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority: p,
      createdAt: new Date().toISOString(),
    };
    tasksStore.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
