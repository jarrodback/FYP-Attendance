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
        failureRedirect: "/auth/",
    }),

    function (req, res) {
        if (process.env.NODE_ENV == "production") {
            res.redirect("https://jarrodback.github.io/FYP-Attendance/");
        } else {
            res.redirect("//localhost:8080/");
        }
    }
);

// Get there user's details.
router.get("/details", isAuthenticated, authController.details);

// Log the user out.
router.post("/logout", authController.logout);

// Export router.
module.exports = router;
