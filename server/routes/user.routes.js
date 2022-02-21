var express = require("express");
var router = express.Router();

// Get the User controller
var userController = require("../controllers/user.controller");

// Find all users.
router.get("/", userController.findAll);

// Export router.
module.exports = router;
