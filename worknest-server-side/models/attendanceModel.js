const { Schema, model } = require("mongoose");

const AttendanceSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      // Don't use index: true here - define it separately below
    },
    employeeName: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      required: true,
      // Don't use index: true here - define it separately below
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

// Define compound unique index ONCE
AttendanceSchema.index(
  { employeeId: 1, date: 1 },
  { unique: true }
);

module.exports = model("attendance", AttendanceSchema);