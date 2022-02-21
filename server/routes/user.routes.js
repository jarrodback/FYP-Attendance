var express = require("express");
var router = express.Router();

// Get the User controller
var userController = require("../controllers/user.controller");

// Find all users.
router.get("/", userController.findAll);

// Find specific user.
router.get("/:id", userController.findOne);

// Create user.
router.post("/", userController.create);

// Update user.
router.put("/:id", userController.update);

// Delete user.
router.delete("/:id", userController.delete);

// Delete all users.
router.delete("/", userController.deleteAll);

// Export router.
module.exports = router;
