const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// basic route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// simple database test route
app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});


/* -------------------------------------------------
Adding the task route after adding tasks table in db
---------------------------------------------------*/

//GET ALL TASKS.
app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
  res.json(result.rows);
});

//CREATE TASK
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.json(result.rows[0]);
});

//UPDATE TASK (complete/uncomplete)
app.put("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;
  const result = await pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  res.json(result.rows[0]);
});

//DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  res.json({ message: "Task deleted" });
});


//suggestedTasks in addtaskUI
const suggestedTasksRouter = require("./routes/suggestedTasks");
app.use("/suggested-tasks", suggestedTasksRouter);



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
