var express = require("express");
var router = express.Router();
require("../middleware/auth");
const passport = require("passport");

// Get the Auth controller
var authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth");

// Log the user in.
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/details",
        failureRedirect: "/auth/",
    })
);

// Get there user's details.
router.get("/details", isAuthenticated, authController.details);

// Export router.
module.exports = router;
