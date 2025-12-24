const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Owner of the task
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Main task title shown on the board
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional short description under the title
    description: {
      type: String,
      trim: true,
    },

    // Column where the task currently lives
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    // Simple category label used for filtering
    tag: {
      type: String,
      trim: true,
      default: "Design",
    },

    // Optional due date shown on the card
    dueDate: {
      type: Date,
    },

    // Controls ordering inside a column
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up loading a user's board
taskSchema.index({ userId: 1, status: 1, order: 1 });

// Helps with due-date based views later
taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
