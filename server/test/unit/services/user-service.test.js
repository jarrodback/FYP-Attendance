let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const UserService = require("../../../services/UserService");

chai.use(chaiAsPromised);

const userId = "46eaed3d-5e8d-49ec-a1f2-7eb6867bdc1b";

describe("Testing User Service", () => {
    const user = {
        username: "username",
        email: "email",
        type: "Student",
        password: "password",
    };

    it("createUser: should make call to the database", (done) => {
        const userService = new UserService();
        userService.postgresService.create = sinon.stub();
        userService.createUser(user);

        expect(userService.postgresService.create.calledOnce).to.be.true;

        done();
    });

    it("createUser: shouldn't be successful because of invalid user", (done) => {
        const invalidUser = {};
        const userService = new UserService();
        userService.postgresService.create = sinon.stub();

        userService
            .createUser(invalidUser)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("User data is invalid.");
                expect(userService.postgresService.create.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("findAllUsers: should be successful", (done) => {
        const userService = new UserService();
        userService.postgresService.findAll = sinon.stub();
        userService.findAll();

        expect(userService.postgresService.findAll.calledOnce).to.be.true;

        done();
    });

    it("findUser: should make call to the database", (done) => {
        const userService = new UserService();
        userService.postgresService.findById = sinon.stub();
        userService.findUser(userId);

        expect(userService.postgresService.findById.calledOnce).to.be.true;

        done();
    });

    it("findUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.postgresService.findById = sinon.stub();

        userService
            .findUser(invalidUserId)
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.postgresService.findById.calledOnce).to.be
                    .false;
            })
            .finally(() => {
                done();
            });
    });

    it("updateUser: should make call to the database", (done) => {
        const userService = new UserService();
        userService.postgresService.update = sinon.stub();
        userService.updateUser(userId, { name: "New name" }, { role: "User" });

        expect(userService.postgresService.update.calledOnce).to.be.true;

        done();
    });

    it("updateUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.postgresService.update = sinon.stub();

        userService
            .updateUser(invalidUserId, {}, { role: "User" })
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.postgresService.update.calledOnce).to.be
                    .false;
            })
            .finally(() => {
                done();
            });
    });

    it("deleteUser: should make call to the database", (done) => {
        const userService = new UserService();
        userService.postgresService.deleteOne = sinon.stub();
        userService.deleteUser(userId);

        expect(userService.postgresService.deleteOne.calledOnce).to.be.true;

        done();
    });

    it("deleteUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.postgresService.deleteOne = sinon.stub();

        userService
            .deleteUser(invalidUserId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.postgresService.deleteOne.calledOnce).to.be
                    .false;
            })
            .finally(() => {
                done();
            });
    });

    it("deleteAllUsers: should make call to the database", (done) => {
        const userService = new UserService();
        userService.postgresService.deleteAll = sinon.stub();
        userService.deleteAllUsers();

        expect(userService.postgresService.deleteAll.calledOnce).to.be.true;

        done();
    });
});
