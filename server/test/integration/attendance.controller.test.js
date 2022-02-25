let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
const sinon = require("sinon");

const baseUrl = "/api/v1/attendance";
let attendanceId;
const userId = "0caf51d2-6648-47ca-bae2-257535cd7f32";
let moduleId;
let fakeAttendanceId = "46eaed3d-5e8d-49ec-a1f2-7eb6867bdc1b";
let fakeUUID = "1";

// STUB AUTHENTICATION.
let server = require("./mockAuthentication").server;
let isAuthenticatedOriginal =
    require("./mockAuthentication").isAuthenticatedOriginal;
let isAdminOriginal = require("./mockAuthentication").isAdminOriginal;
let auth = require("./mockAuthentication").auth;

describe("Testing the /api/v1/attendance path", () => {
    describe("GET /api/v1/attendance", () => {
        it("it should return list of attendance data", (done) => {
            chai.request(server)
                .get(baseUrl)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(2);
                    attendanceId = res.body[0].id;

                    done();
                });
        });

        it("it should return list of attendance data using filter", (done) => {
            chai.request(server)
                .get(`${baseUrl}?id=${attendanceId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(1);

                    done();
                });
        });

        it("it should return a single attendance", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${attendanceId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.Module.name.should.be.eql("Module 1");
                    res.body.User.username.should.be.eql("username");
                    moduleId = res.body.ModuleId;

                    done();
                });
        });

        it("it shouldn't find an invalid attendance", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${fakeAttendanceId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a("object");
                    res.body.message.should.be.eql(
                        "Attendance data does not exist."
                    );

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

    describe("POST /api/v1/attendance", () => {
        it("it shouldn't create a Attendance with invalid data", (done) => {
            const attendance = {};
            chai.request(server)
                .post(baseUrl)
                .send(attendance)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(
                        "Attendance data is invalid."
                    );

                    done();
                });
        });

        it("it should create a Attendance", (done) => {
            const attendance = {
                arrivalTime: "2022-02-25T12:40:00.2Z",
                UserId: userId,
            };
            chai.request(server)
                .post(baseUrl)
                .send(attendance)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(
                        "Attendance was successfully created."
                    );

                    done();
                });
        });
    });

    describe("PUT /api/v1/attendance", () => {
        it("it should update the attendance", (done) => {
            let to_update = {
                departureTime: new Date(),
            };
            chai.request(server)
                .put(`${baseUrl}/${attendanceId}`)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it("it shouldn't update an invalid attendance", (done) => {
            let to_update = {
                attendancename: "bob12",
            };
            chai.request(server)
                .put(`${baseUrl}/${fakeAttendanceId}`)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Attendance does not exist.");

                    done();
                });
        });
    });

    describe("DELETE /api/v1/attendance", () => {
        it("it should delete a Attendance", (done) => {
            chai.request(server)
                .delete(`${baseUrl}/${attendanceId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Attendance was successfully deleted.");

                    done();
                });
        });

        it("it shouldn't delete an invalid attendance", (done) => {
            chai.request(server)
                .delete(`${baseUrl}/${fakeAttendanceId}`)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it("it should delete all Attendances", (done) => {
            chai.request(server)
                .delete(`${baseUrl}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Attendances were successfully deleted.");
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

    describe("Testing the /api/v1/attendance path when unauthenticated", () => {
        before(function (done) {
            auth.isAuthenticated.callsFake((req, res, next) => {
                return isAuthenticatedOriginal(req, res, next);
            });

            done();
        });

        it("it should return a 401 when getting attendances", (done) => {
            chai.request(server)
                .get(`${baseUrl}?type=Lecturer`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });

        it("it should return a 401 when getting a attendance", (done) => {
            chai.request(server)
                .get(`${baseUrl}/${attendanceId}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });

        it("it should return a 401 when deleteing a attendance", (done) => {
            chai.request(server)
                .delete(`${baseUrl}/${attendanceId}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });

        it("it should return a 401 when deleteing all attendances", (done) => {
            chai.request(server)
                .delete(`${baseUrl}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });

        it("it should return a 401 when updating a attendance", (done) => {
            let to_update = {
                attendancename: "bob12",
            };
            chai.request(server)
                .put(`${baseUrl}/${fakeAttendanceId}`)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });

        it("it should return a 401 when creating a attendance", (done) => {
            const attendance = {
                attendancename: "Test_attendancename",
                email: "test@email.com",
                password: "test",
            };
            chai.request(server)
                .post(baseUrl)
                .send(attendance)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql("Unauthorized: You are not signed in.");

                    done();
                });
        });
    });

    describe("Testing the /api/v1/attendance path when unathorized", () => {
        before(function (done) {
            auth.isAuthenticated.callsFake((req, res, next) => {
                next();
            });

            auth.isAdmin.callsFake((req, res, next) => {
                return isAdminOriginal(req, res, next);
            });

            done();
        });

        it("it should return a 403 when deleteing all attendances without permissions", (done) => {
            chai.request(server)
                .delete(`${baseUrl}`)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.a
                        .property("message")
                        .eql(
                            "Unauthorized: You do not have permission to perform this action."
                        );

                    done();
                });
        });
    });
});
