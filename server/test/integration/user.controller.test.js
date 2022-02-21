let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../app");
let should = chai.should();
chai.use(chaiHttp);

const baseUrl = "/api/v1/user";

describe("Testing the /api/v1/user path", () => {
    describe("GET /api/v1/user", () => {
        it("it should return list of user data", (done) => {
            chai.request(server)
                .get(baseUrl)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(3);

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
    });
});
