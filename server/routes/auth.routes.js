var express = require("express");
var router = express.Router();
require("../middleware/auth");
const passport = require("passport");

// Get the Auth controller
var authController = require("../controllers/auth.controller");

// Find all attendance.
router.get("/", authController.default);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/login",
        failureRedirect: "/",
    })
);

router.get("/login", authController.login);

// Export router.
module.exports = router;
