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
        res.redirect("//localhost:8080/");
        //     let prevSession = req.session;
        //     req.session.regenerate((err) => {
        //         Object.assign(req.session, prevSession);
        //     });
    }
);

// Get there user's details.
router.get("/details", isAuthenticated, authController.details);

// Log the user out.
router.post("/logout", authController.logout);

// Export router.
module.exports = router;
