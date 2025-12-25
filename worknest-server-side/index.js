const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const activeRoutes = require("./routes/activeRoutes");

// Debug: Check which routes are undefined
console.log('🔍 Debug - Route Types:');
console.log('userRoutes:', typeof userRoutes);
console.log('workspaceRoutes:', typeof workspaceRoutes);
console.log('analyticsRoutes:', typeof analyticsRoutes);
console.log('notificationRoutes:', typeof notificationRoutes);
console.log('attendanceRoutes:', typeof attendanceRoutes);
console.log('activeRoutes:', typeof activeRoutes);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - CORS with proper configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware - Log ALL requests
app.use((req, res, next) => {
  console.log(`\n📍 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ===== MONGODB ROUTES (Custom Backend) =====
// These handle attendance with MongoDB
app.use("/api", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);

// ===== OTHER CUSTOM ROUTES =====
app.use(userRoutes);
app.use("/dashboard", workspaceRoutes);
app.use("/dashboard", activeRoutes);
app.use("/dashboard", analyticsRoutes);

// ===== JSON SERVER ROUTES (For Users Data) =====
// This serves your db.json file for user management
const jsonRouter = jsonServer.router('db.json');
const jsonMiddlewares = jsonServer.defaults();

// Use JSON Server for remaining routes (like /users)
app.use(jsonMiddlewares);
app.use(jsonRouter);

app.listen(PORT, () => {
  console.log(`\n✅ Unified Server running on port ${PORT}`);
  console.log(`✅ MongoDB Backend: /api/attendance/*`);
  console.log(`✅ JSON Server: /users, /bookings, etc.`);
  console.log(`✅ CORS enabled for http://localhost:5173`);
  console.log(`✅ Check health: http://localhost:${PORT}/health\n`);
});