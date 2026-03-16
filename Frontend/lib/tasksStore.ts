import type { Task } from "@/types";
import { mockTasks } from "./mockData";

// Shared in-memory store for API routes (use a database in production)
export const tasksStore: Task[] = [...mockTasks];
