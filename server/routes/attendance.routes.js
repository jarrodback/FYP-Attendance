var express = require("express");
var router = express.Router();

// Get the Attendance controller
var attendanceController = require("../controllers/attendance.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Find all attendance.
router.get("/", isAuthenticated, attendanceController.findAll);

// Find specific attendance.
router.get("/:id", isAuthenticated, attendanceController.findOne);

// Create an attendance record.
router.post("/", isAuthenticated, attendanceController.create);
router.post("/reader", attendanceController.create);

// Update attendance.
router.put("/:id", isAuthenticated, attendanceController.update);

// Delete attendance.
router.delete("/:id", isAuthenticated, attendanceController.delete);

// Delete all attendance.
router.delete("/", isAuthenticated, isAdmin, attendanceController.deleteAll);

// Export router.
module.exports = router;
