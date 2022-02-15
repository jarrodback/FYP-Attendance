var express = require("express");
var router = express.Router();

// Get the Attendance controller
var attendanceController = require("../controllers/attendance.controller");

// Find all attendance.
router.get("/", attendanceController.findAll);

// Export router.
module.exports = router;
