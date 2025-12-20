const Attendance = require("../models/attendanceModel");

// Check-in function
const checkIn = async (req, res) => {
  try {
    const { employeeId, employeeName } = req.body;

    console.log('=== CHECK-IN REQUEST ===');
    console.log('Body:', req.body);

    if (!employeeId || !employeeName) {
      console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: employeeId and employeeName',
      });
    }

    // Normalize date to start of day UTC
    const day = new Date();
    day.setUTCHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingCheckIn = await Attendance.findOne({
      employeeId: employeeId,
      date: day,
    });

    if (existingCheckIn) {
      console.log('Already checked in today:', existingCheckIn);
      return res.status(200).json({
        success: true,
        message: 'Already checked in today',
        attendance: existingCheckIn,
      });
    }

    const attendance = new Attendance({
      employeeId: employeeId,
      employeeName: employeeName,
      date: day,
      checkInTime: new Date(),
      checkOutTime: null,
      totalHours: 0,
    });

    await attendance.save();

    console.log('✅ Check-in successful:', attendance);
    return res.status(201).json({
      success: true,
      message: 'Check-in successful',
      attendance,
    });
  } catch (err) {
    console.error('=== CHECK-IN ERROR ===');
    console.error(err);

    // MongoDB duplicate → already checked-in today
    if (err.code === 11000) {
      console.log('Duplicate key → already checked in today');
      return res.status(200).json({
        success: true,
        message: 'Already checked in today',
      });
    }

    // validation / other
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({
      success: false,
      message: 'Error checking in',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// Check-out function
const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    console.log('=== CHECK-OUT REQUEST ===');
    console.log('EmployeeId:', employeeId);

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Missing employeeId' });
    }

    // Normalize date to start of day UTC
    const day = new Date();
    day.setUTCHours(0, 0, 0, 0);

    // Find today's check-in record using correct field names
    const attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: day,
    });

    if (!attendance) {
      console.log('No check-in record found for today');
      return res.status(404).json({
        success: false,
        message: 'No check-in record found for today. Please check in first.',
      });
    }

    if (attendance.checkOutTime) {
      console.log('Already checked out:', attendance);
      return res.status(200).json({
        success: true,
        message: 'Already checked out',
        attendance,
      });
    }

    // Record checkout time
    attendance.checkOutTime = new Date();

    // Calculate total hours (float, 2 decimals)
    const msDiff = attendance.checkOutTime - attendance.checkInTime;
    attendance.totalHours = Math.round((msDiff / (1000 * 60 * 60)) * 100) / 100;

    await attendance.save();

    console.log('✅ Check-out successful:', attendance);
    return res.status(200).json({
      success: true,
      message: 'Check-out successful',
      attendance,
    });
  } catch (err) {
    console.error('=== CHECK-OUT ERROR ===');
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error checking out',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// Get attendance records for an employee
const getAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    console.log("=== GET ATTENDANCE REQUEST ===");
    console.log("EmployeeId:", employeeId);

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Missing employeeId",
      });
    }

    // Get all attendance records for this employee, sorted by date (newest first)
    const attendance = await Attendance.find({ employeeId: employeeId })
      .sort({ date: -1 })
      .lean();

    console.log(`✅ Found ${attendance.length} attendance records`);

    return res.status(200).json({
      success: true,
      attendance: attendance,
      count: attendance.length,
    });
  } catch (error) {
    console.error("=== GET ATTENDANCE ERROR ===");
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching attendance data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get total hours for an employee (optional: within a date range)
const getTotalHours = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    console.log("=== GET TOTAL HOURS REQUEST ===");
    console.log("EmployeeId:", employeeId);
    console.log("Date range:", { startDate, endDate });

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Missing employeeId",
      });
    }

    // Build query using correct field names
    const query = { employeeId: employeeId };

    // Add date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query).lean();

    // Calculate total hours
    const totalHours = attendanceRecords.reduce((sum, record) => {
      return sum + (record.totalHours || 0);
    }, 0);

    console.log(`✅ Total hours: ${totalHours.toFixed(2)} from ${attendanceRecords.length} records`);

    return res.status(200).json({
      success: true,
      totalHours: parseFloat(totalHours.toFixed(2)),
      recordCount: attendanceRecords.length,
      records: attendanceRecords,
    });
  } catch (error) {
    console.error("=== GET TOTAL HOURS ERROR ===");
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error calculating total hours",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getTotalHours,
};