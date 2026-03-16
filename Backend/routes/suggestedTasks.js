const express = require("express");
const router = express.Router();
const pool = require("../db"); // your PostgreSQL pool

// GET /suggested-tasks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM suggested_tasks ORDER BY id");
    res.json(result.rows); // returns array of objects { id, title }
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();

// // Mock DB for now (we'll replace with PostgreSQL later)
// let suggestedTasks = [
//   "Check emails",
//   "Exercise",
//   "Read for 15 min",
//   "Plan tomorrow",
//   "Drink water",
//   "Take a short break",
//   "Review goals",
//   "Meditate",
//   "Clear inbox",
//   "Stand / stretch",
//   "Learn something new",
//   "Call someone",
//   "Write / journal",
//   "Organize workspace",
//   "Review calendar",
// ];

// router.get("/", (req, res) => {
//   res.json(suggestedTasks);
// });

// module.exports = router;