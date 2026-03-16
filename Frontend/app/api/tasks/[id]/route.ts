import { NextResponse } from "next/server";
import { tasksStore } from "@/lib/tasksStore";
import type { Task } from "@/types";

const VALID_PRIORITIES = ["low", "medium", "high"] as const;

function setTaskById(id: string, updater: (t: Task) => Task) {
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx >= 0) tasksStore[idx] = updater(tasksStore[idx]);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = tasksStore.find((t) => t.id === id);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = tasksStore.find((t) => t.id === id);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const priority = body.priority !== undefined && VALID_PRIORITIES.includes(body.priority) ? body.priority : undefined;
    setTaskById(id, (t) => ({
      ...t,
      ...(body.title !== undefined && { title: String(body.title) }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.completed !== undefined && { completed: Boolean(body.completed) }),
      ...(priority !== undefined && { priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
    }));
    const updated = tasksStore.find((t) => t.id === id)!;
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  tasksStore.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
