var express = require("express");
var router = express.Router();

// Get the User controller
var userController = require("../controllers/user.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Find all users.
router.get("/", isAuthenticated, userController.findAll);

// Find specific user.
router.get("/:id", isAuthenticated, userController.findOne);

// Create user.
router.post("/", isAuthenticated, userController.create);

// Get all users in the module
router.get("/module/:id", isAuthenticated, userController.findModuleUsers);

// Update module user
router.put("/module", isAuthenticated, userController.updateModuleUser);

// Update user.
router.put("/:id", isAuthenticated, userController.update);

// Delete user.
router.delete("/:id", isAuthenticated, userController.delete);

// Delete all users.
router.delete("/", isAuthenticated, isAdmin, userController.deleteAll);

// Export router.
module.exports = router;
