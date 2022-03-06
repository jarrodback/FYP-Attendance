require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

let callbackURL;

if (process.env.NODE_ENV == "production") {
    callbackURL =
        "https://fyp-attendance-system.herokuapp.com/auth/google/callback";
} else {
    callbackURL = "http://localhost:3050/auth/google/callback";
}

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "717218480104-o8v2nsmhhc8q311fu1ej0ijfqqf0m4e9.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3050/auth/google/callback",
            passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res
            .status(401)
            .send({ message: "Unauthorized: You are not signed in." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.type === "Lecturer") {
        return next();
    } else {
        return res.status(403).send({
            message:
                "Unauthorized: You do not have permission to perform this action.",
        });
    }
};

module.exports = { isAuthenticated, isAdmin };
