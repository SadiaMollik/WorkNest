const User = require("../models/userModel");
const Task = require("../models/taskModel");

// Finds a user using Firebase uid
const findUserByUid = async (uid) => {
  if (!uid) return null;
  return await User.findOne({ uid });
};

// Get all tasks for the logged-in user
const getMyTasks = async (req, res) => {
  try {
    const uid = req.headers["x-user-uid"];
    const user = await findUserByUid(uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const tasks = await Task.find({ userId: user._id }).sort({
      status: 1,
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("getMyTasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load tasks.",
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const uid = req.headers["x-user-uid"];
    const user = await findUserByUid(uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const { title, description, tag, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    const lastTask = await Task.findOne({
      userId: user._id,
      status: status || "todo",
    }).sort({ order: -1 });

    const nextOrder = lastTask ? lastTask.order + 1 : 1;

    const task = await Task.create({
      userId: user._id,
      title: title.trim(),
      description: description?.trim(),
      tag,
      status,
      dueDate,
      order: nextOrder,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

// Update task fields or move between columns
const updateTask = async (req, res) => {
  try {
    const uid = req.headers["x-user-uid"];
    const user = await findUserByUid(uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const updates = req.body;

    if (typeof updates.title === "string") task.title = updates.title.trim();
    if (typeof updates.description === "string")
      task.description = updates.description.trim();
    if (typeof updates.tag === "string") task.tag = updates.tag;
    if (typeof updates.status === "string") task.status = updates.status;
    if (updates.dueDate !== undefined) task.dueDate = updates.dueDate || null;
    if (typeof updates.order === "number") task.order = updates.order;

    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("updateTask error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const uid = req.headers["x-user-uid"];
    const user = await findUserByUid(uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.json({
      success: true,
      message: "Task deleted.",
    });
  } catch (error) {
    console.error("deleteTask error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task.",
    });
  }
};

module.exports = {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
};
