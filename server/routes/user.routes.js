var express = require("express");
var router = express.Router();

// Get the User controller
var userController = require("../controllers/user.controller");
const { isAuthenticated } = require("../middleware/auth");

// Find all users.
router.get("/", isAuthenticated, userController.findAll);

// Find specific user.
router.get("/:id", isAuthenticated, userController.findOne);

// Create user.
router.post("/", isAuthenticated, userController.create);

// Update user.
router.put("/:id", isAuthenticated, userController.update);

// Delete user.
router.delete("/:id", isAuthenticated, userController.delete);

// Delete all users.
router.delete("/", isAuthenticated, userController.deleteAll);

// Export router.
module.exports = router;
