let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
const sinon = require("sinon");

const baseUrl = "/api/v1/user";
let userId;
let fakeUserId = "46eaed3d-5e8d-49ec-a1f2-7eb6867bdc1b";
let fakeUUID = "1";

const auth = require("../../middleware/auth/index");
const isAuthenticatedStub = sinon.stub(auth, "isAuthenticated");

let server = require("../../app");

before(function (done) {
    auth.isAuthenticated.callsFake((req, res, next) => {
        next();
    });

    done();
});

describe("Testing the /api/v1/user path", () => {
    describe("GET /api/v1/user", () => {
        it("it should return list of user data", (done) => {
            chai.request(server)
                .get(baseUrl)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(2);
                    userId = res.body[0].id;

                    done();
                });
        });

        it("it should return list of user data using filter", (done) => {
            chai.request(server)
                .get(`${baseUrl}?type=Lecturer`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(1);

                    done();
                });
        });

        it("it should return a single user", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.username.should.be.eql("username");
                    res.body.email.should.be.eql("email");
                    res.body.type.should.be.eql("Student");
                    res.body.Modules.should.be.a("array");
                    res.body.Modules[0].name.should.be.eql("Module 1");

                    done();
                });
        });

        it("it shouldn't find an invalid user", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${fakeUserId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a("object");
                    res.body.message.should.be.eql("User does not exist.");

                    done();
                });
        });

        it("it shouldn't find an invalid UUID", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${fakeUUID}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.message.should.be.eql("UUID is invalid.");

                    done();
                });
        });
    });

    describe("POST /api/v1/user", () => {
        it("it shouldn't create a User with invalid data", (done) => {
            const user = {
                username: "Test_username",
                email: "test@email.com",
                password: "test",
            };
            chai.request(server)
                .post(baseUrl)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql("User data is invalid.");

                    done();
                });
        });

        it("it should create a User", (done) => {
            const user = {
                username: "Test_username",
                email: "test@email.com",
                password: "test",
                type: "Student",
            };
            chai.request(server)
                .post(baseUrl)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(
                        "User was successfully created."
                    );

                    done();
                });
        });

        it("it shouldn't create a User with a duplicate email", (done) => {
            const user = {
                username: "Test_username2",
                email: "test@email.com",
                password: "test",
                type: "Student",
            };
            chai.request(server)
                .post(baseUrl)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql("Email is already in use.");

                    done();
                });
        });

        it("it shouldn't create a User with a duplicate username", (done) => {
            const user = {
                username: "Test_username",
                email: "test2@email.com",
                password: "test",
                type: "Student",
            };
            chai.request(server)
                .post(baseUrl)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(
                        "Username is already in use."
                    );

                    done();
                });
        });
    });

    describe("PUT /api/v1/user", () => {
        it("it should update the user", (done) => {
            let to_update = {
                username: "backjarrod",
            };
            chai.request(server)
                .put(`${baseUrl}/${userId}`)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get(`${baseUrl}/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("object");
                    res.body.should.have.property("username").eql("backjarrod");

                    done();
                });
        });

        it("it shouldn't update an invalid user", (done) => {
            let to_update = {
                username: "bob12",
            };
            chai.request(server)
                .put(`${baseUrl}/${fakeUserId}`)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("User does not exist.");

                    done();
                });
        });
    });

    describe("DELETE /api/v1/user", () => {
        it("it should delete a User", (done) => {
            chai.request(server)
                .delete(`${baseUrl}/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("User was successfully deleted.");

                    done();
                });
        });

        it("it shouldn't delete an invalid user", (done) => {
            chai.request(server)
                .delete(`${baseUrl}/${fakeUserId}`)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it("it should delete all Users", (done) => {
            chai.request(server)
                .delete(`${baseUrl}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Users were successfully deleted.");
                });

            chai.request(server)
                .get(`${baseUrl}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);

                    done();
                });
        });
    });
});
