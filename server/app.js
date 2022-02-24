const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const cookieSession = require("cookie-session");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const passport = require("passport");
require("dotenv").config();

const db = require("./models/index");
db.sequelize.sync().catch((error) => {
    console.log("Failed to sync models with database.", error);
});

var app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true }));

app.use(
    cookieSession({
        name: "attendanceSystem-token",
        secret: process.env.TOKEN_SECRET,
        httpOnly: true,
        //secure: true - Disabled as don't use HTTPS over local host so the cookie won't set.
        keys: [process.env.TOKEN_SECRET],
    })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * OpenAPI (Swagger) Setup
 */
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ReadBooks: Online API",
            version: "1.0.0",
            description: "Documentation for the Attendance System API.",
            contact: {
                name: "Attendance System API Admin",
                url: "http://localhost:8080",
            },
        },

        servers: [
            {
                url: "http://localhost:3050",
                description: "API Documentation",
            },
        ],
    },
    apis: ["./Routes/*.js"],

    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "attendanceSystem-token",
            },
        },
    },
};

const specs = swaggerJsDoc(options);

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(specs, { explorer: true })
);

/**
 * Router setup
 */
var attendanceRouter = require("./routes/attendance.routes");
var userRouter = require("./routes/user.routes");
var authRouter = require("./routes/auth.routes");

/**
 * View Engine setup
 */
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuring the main routes
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/user", userRouter);
app.use("/auth", authRouter);

/**
 * Error handling
 */
// Catch a 404 error
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // Only show errors in development build
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
