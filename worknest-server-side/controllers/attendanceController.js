const Attendance = require("../models/attendanceModel");

const checkIn = async (req, res) => {
  try {
    const { employeeId, employeeName } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
    }

    const newAttendance = new Attendance({
      employeeId,
      employeeName,
      checkInTime: new Date(),
      date: today,
    });

    await newAttendance.save();

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error checking in",
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
      checkOutTime: null,
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "No active check-in found for today",
      });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60); // in hours

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = totalHours;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error checking out",
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendanceRecords = await Attendance.find({ employeeId }).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance records",
    });
  }
};

const getTotalHours = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(query);

    const totalHours = attendanceRecords.reduce(
      (sum, record) => sum + record.totalHours,
      0
    );

    res.status(200).json({
      success: true,
      totalHours,
      recordsCount: attendanceRecords.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error calculating total hours",
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getTotalHours,
};
