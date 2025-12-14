const Booking = require("../models/bookingModel");
const Attendance = require("../models/attendanceModel");
const Workspace = require("../models/workspaceModel");

// Return last N days as YYYY-MM-DD strings
const getLastNDays = (count = 7) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  return days;
};

// Main analytics endpoint used by Analytics.jsx
const getLatestAnalytics = async (req, res) => {
  try {
    const daysCount = Number(req.query.days) || 7;
    const days = getLastNDays(daysCount);

    // Load active workspaces once
    const workspaces = await Workspace.find({ status: "active" }).select(
      "_id type location"
    );

    const deskIds = workspaces
      .filter((w) => w.type === "desk")
      .map((w) => w._id);
    const roomIds = workspaces
      .filter((w) => w.type === "meeting-room")
      .map((w) => w._id);

    const totalDesks = deskIds.length;
    const totalMeetingRooms = roomIds.length;

    const startDate = new Date(days[0]);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(days[days.length - 1]);
    endDate.setHours(23, 59, 59, 999);

    // Desk bookings grouped by day
    const deskBookings = await Booking.find({
      status: "confirmed",
      workspaceId: { $in: deskIds },
      startAt: { $lte: endDate },
      endAt: { $gte: startDate },
    }).select("startAt");

    const deskBookedByDay = {};
    deskBookings.forEach((b) => {
      const day = b.startAt.toISOString().slice(0, 10);
      deskBookedByDay[day] = (deskBookedByDay[day] || 0) + 1;
    });

    const deskUsageByDay = days.map((day) => ({
      day,
      booked: deskBookedByDay[day] || 0,
      total: totalDesks,
    }));

    // Meeting room bookings grouped by day
    const meetingBookings = await Booking.find({
      status: "confirmed",
      workspaceId: { $in: roomIds },
      startAt: { $lte: endDate },
      endAt: { $gte: startDate },
    }).select("startAt");

    const meetingCountByDay = {};
    meetingBookings.forEach((b) => {
      const day = b.startAt.toISOString().slice(0, 10);
      meetingCountByDay[day] = (meetingCountByDay[day] || 0) + 1;
    });

    const meetingFrequencyByDay = days.map((day) => ({
      day,
      meetings: meetingCountByDay[day] || 0,
    }));

    // Attendance split by day and mode
    const attendanceDocs = await Attendance.find({ day: { $in: days } }).select(
      "day mode"
    );

    const attendanceMap = {};
    days.forEach((day) => {
      attendanceMap[day] = { day, office: 0, remote: 0 };
    });

    attendanceDocs.forEach((a) => {
      if (!attendanceMap[a.day]) return;
      if (a.mode === "office") attendanceMap[a.day].office += 1;
      if (a.mode === "remote") attendanceMap[a.day].remote += 1;
    });

    const attendanceByDay = days.map((day) => attendanceMap[day]);

    // Workspace split for pie chart
    const spaceTypeDistribution = [
      { name: "Desk", value: totalDesks },
      { name: "Meeting Room", value: totalMeetingRooms },
    ];

    // Simple location grouping for map
    const locationCount = {};
    workspaces.forEach((w) => {
      const building = w.location?.building || "Unknown";
      const floor = w.location?.floor || "Unknown";
      const zone = w.location?.zone || "Unknown";
      const key = `${building}__${floor}__${zone}`;
      locationCount[key] = (locationCount[key] || 0) + 1;
    });

    const officeLocation = Object.entries(locationCount).map(([key, count]) => {
      const [building, floor, zone] = key.split("__");
      return { building, floor, zone, count };
    });

    // Summary numbers for top cards
    const totalBooked = deskUsageByDay.reduce((s, d) => s + d.booked, 0);
    const totalCapacity = deskUsageByDay.reduce((s, d) => s + d.total, 0);

    const avgDeskOccupancy =
      totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    const totalMeetings = meetingFrequencyByDay.reduce(
      (s, d) => s + d.meetings,
      0
    );

    const avgInOffice =
      attendanceByDay.length > 0
        ? Math.round(
            attendanceByDay.reduce((s, d) => s + d.office, 0) /
              attendanceByDay.length
          )
        : 0;

    const busiestDay =
      deskUsageByDay.sort((a, b) => b.booked - a.booked)[0]?.day || "-";

    res.json({
      success: true,
      analytics: {
        deskUsageByDay,
        meetingFrequencyByDay,
        attendanceByDay,
        spaceTypeDistribution,
        officeLocation,
      },
      summary: {
        avgDeskOccupancy,
        totalMeetings,
        avgInOffice,
        busiestDay,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  getLatestAnalytics,
};
