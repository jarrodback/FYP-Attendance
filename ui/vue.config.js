module.exports = {
    devServer: {
        host: "0.0.0.0",
    },
    publicPath:
        process.env.NODE_ENV === "production" ? "/FYP-Attendance/" : "/",
};
