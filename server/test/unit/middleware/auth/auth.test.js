let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const auth = require("../../../../middleware/auth");

chai.use(chaiAsPromised);

describe("Testing isAuthenticated", () => {
    it("isAuthenticated: should be successful", (done) => {
        let res = {
            send: function () {},
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();
        let req = {
            isAuthenticated: function () {
                return true;
            },
            user: { type: "Student" },
        };

        auth.isAuthenticated(req, res, next);

        expect(next.calledOnce).to.be.true;

        done();
    });

    it("isAdmin: should be successful", (done) => {
        let res = {
            send: function () {},
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();
        let req = {
            isAuthenticated: function () {
                return true;
            },
            user: { type: "Lecturer" },
        };

        auth.isAdmin(req, res, next);

        expect(next.calledOnce).to.be.true;

        done();
    });

    it("isAdmin: shouldn't be successful", (done) => {
        let res = {
            send: function () {},
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();
        let req = {
            isAuthenticated: function () {
                return true;
            },
            user: { type: "Student" },
        };

        auth.isAdmin(req, res, next);

        expect(next.calledOnce).to.be.false;

        done();
    });
});
