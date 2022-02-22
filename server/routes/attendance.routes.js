var express = require("express");
var router = express.Router();

// Get the Attendance controller
var attendanceController = require("../controllers/attendance.controller");
const { isAuthenticated } = require("../middleware/auth");

// Find all attendance.
router.get("/", isAuthenticated, attendanceController.findAll);

// Create an attendance record.
router.post("/", isAuthenticated, attendanceController.create);

// Export router.
module.exports = router;
