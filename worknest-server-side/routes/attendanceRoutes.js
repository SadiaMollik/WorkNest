const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAttendance,
  getTotalHours,
} = require("../controllers/attendanceController");

router.post("/attendance/checkin", checkIn);
router.post("/attendance/checkout", checkOut);
router.get("/attendance/:employeeId", getAttendance);
router.get("/attendance/hours/:employeeId", getTotalHours);

module.exports = router;
