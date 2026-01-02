const express = require("express");
const router = express.Router();

const {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/nestboard/tasks", getMyTasks);
router.post("/nestboard/tasks", createTask);
router.patch("/nestboard/tasks/:id", updateTask);
router.delete("/nestboard/tasks/:id", deleteTask);

module.exports = router;
