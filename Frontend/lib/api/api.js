const BASE_URL = "http://localhost:5000"; // your backend URL

// Get all tasks
export async function getTasks() {
  try {
    const res = await fetch(`${BASE_URL}/tasks`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

// Get single task by ID
export async function getTaskById(id) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`);
    return await res.json();
  } catch (err) {
    console.error(`Error fetching task ${id}:`, err);
    return null;
  }
}

// Create a new task
export async function createTask(task) {
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  } catch (err) {
    console.error("Error creating task:", err);
    return null;
  }
}

// Update a task
export async function updateTask(id, updatedTask) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    return await res.json();
  } catch (err) {
    console.error(`Error updating task ${id}:`, err);
    return null;
  }
}

// Delete a task
export async function deleteTask(id) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    console.error(`Error deleting task ${id}:`, err);
    return null;
  }
}