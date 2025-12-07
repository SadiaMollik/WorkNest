const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["desk", "meeting-room"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: function () {
        return this.type === "meeting-room";
      },
    },
    amenities: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("workspace", workspaceSchema);
