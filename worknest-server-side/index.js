const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", workspaceRoutes);
app.use("/api", notificationRoutes);
app.use("/api", attendanceRoutes);

// all routes for analytics
app.use("/dashboard", analyticsRoutes);
// all routes for notifications
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
