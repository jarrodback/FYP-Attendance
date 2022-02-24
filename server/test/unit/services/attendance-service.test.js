let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const AttendanceService = require("../../../services/AttendanceService");

chai.use(chaiAsPromised);

const attendanceId = "46eaed3d-5e8d-49ec-a1f2-7eb6867bdc1b";

describe("Testing Attendance Service", () => {
    const attendance = {
        ModuleId: attendanceId,
        UserId: attendanceId,
        arrivalTime: new Date(),
    };

    it("createAttendance: should make call to the database", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.create = sinon.stub();
        attendanceService.createAttendance(attendance);

        expect(attendanceService.postgresService.create.calledOnce).to.be.true;

        done();
    });

    it("createAttendance: shouldn't be successful because of invalid attendance", (done) => {
        const invalidAttendance = {};
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.create = sinon.stub();

        attendanceService
            .createAttendance(invalidAttendance)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("Attendance data is invalid.");
                expect(attendanceService.postgresService.create.calledOnce).to
                    .be.false;

                done();
            });
    });

    it("findAllAttendances: should be successful", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.findAll = sinon.stub();
        attendanceService.findAll();

        expect(attendanceService.postgresService.findAll.calledOnce).to.be.true;

        done();
    });

    it("findAttendance: should make call to the database", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.findById = sinon.stub();
        attendanceService.findOne(attendanceId);

        expect(attendanceService.postgresService.findById.calledOnce).to.be
            .true;

        done();
    });

    it("findAttendance: shouldn't be successful because of invalid Id", (done) => {
        const invalidAttendanceId = "1234567891221sggs";
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.findById = sinon.stub();

        attendanceService
            .findOne(invalidAttendanceId)
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("Attendance ID is invalid.");
                expect(attendanceService.postgresService.findById.calledOnce).to
                    .be.false;
            })
            .finally(() => {
                done();
            });
    });

    it("updateAttendance: should make call to the database", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.update = sinon.stub();
        attendanceService.updateAttendance(
            attendanceId,
            { name: "New name" },
            { role: "Attendance" }
        );

        expect(attendanceService.postgresService.update.calledOnce).to.be.true;

        done();
    });

    it("updateAttendance: shouldn't be successful because of invalid Id", (done) => {
        const invalidAttendanceId = "1234567891221sggs";
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.update = sinon.stub();

        attendanceService
            .updateAttendance(invalidAttendanceId, {}, { role: "Attendance" })
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Attendance ID is invalid.");
                expect(attendanceService.postgresService.update.calledOnce).to
                    .be.false;
            })
            .finally(() => {
                done();
            });
    });

    it("deleteAttendance: should make call to the database", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.deleteOne = sinon.stub();
        attendanceService.deleteAttendance(attendanceId);

        expect(attendanceService.postgresService.deleteOne.calledOnce).to.be
            .true;

        done();
    });

    it("deleteAttendance: shouldn't be successful because of invalid Id", (done) => {
        const invalidAttendanceId = "1234567891221sggs";
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.deleteOne = sinon.stub();

        attendanceService
            .deleteAttendance(invalidAttendanceId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Attendance ID is invalid.");
                expect(attendanceService.postgresService.deleteOne.calledOnce)
                    .to.be.false;
            })
            .finally(() => {
                done();
            });
    });

    it("deleteAllAttendances: should make call to the database", (done) => {
        const attendanceService = new AttendanceService();
        attendanceService.postgresService.deleteAll = sinon.stub();
        attendanceService.deleteAllAttendance();

        expect(attendanceService.postgresService.deleteAll.calledOnce).to.be
            .true;

        done();
    });
});
