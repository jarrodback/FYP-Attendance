const sinon = require("sinon");

const auth = require("../../middleware/auth/index");
const isAuthenticatedOriginal = auth.isAuthenticated;
const isAdminOriginal = auth.isAdmin;
sinon.stub(auth, "isAuthenticated");
sinon.stub(auth, "isAdmin");

let server = require("../../app");

before(function (done) {
    auth.isAuthenticated.callsFake((req, res, next) => {
        next();
    });

    auth.isAdmin.callsFake((req, res, next) => {
        next();
    });

    done();
});

module.exports = { isAuthenticatedOriginal, isAdminOriginal, server, auth };
