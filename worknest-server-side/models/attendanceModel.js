const { Schema, model } = require("mongoose");

const AttendanceSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      required: true,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const AttendanceModel = model("attendance", AttendanceSchema);

module.exports = AttendanceModel;
