const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("AdminController", () => {
  before(() => {
    //silence the console
    console.log = function () {};
  });
  var token; // this will store the JWT token
  before((done) => {
    request(sails.hooks.http.app)
      .post("/login")
      .send({ email: "admin@gmail.com", password: "admin123" }) // assuming your authentication endpoint is /auth/login
      .end((err, res) => {
        const { user } = res.body;
        if (err) {
          return done(err);
        }
        token = user.token;
        done();
      });
  });
  describe("GET /admin/dashboard", () => {
    it("Display all user and user's post", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/dashboard")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });
  describe("GET /admin/users/posts/:id", () => {
    let userId;
    before((done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "utsav123@gmail.com", password: "123456" }) // assuming your authentication endpoint is /auth/login
        .end((err, res) => {
          const { user } = res.body;
          if (err) {
            return done(err);
          }
          userId = user.id;
          done();
        });
    });
    it("should return 404 if send invalid id", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/users/posts/64057c52790487174448e12")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("invalid user");
          done();
        });
    });
    it("should return 200 and post of user which id pass in params", (done) => {
      request(sails.hooks.http.app)
        .get(`/admin/users/posts/${userId}`)
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });
  describe("POST /admin/toggleUser/:userId", () => {
    it("should return 404 if user not found", (done) => {
      request(sails.hooks.http.app)
        .post("/admin/toggleUser/64057bd3790487174448e1")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("User not found");
          done();
        });
    });
    it("should return 200 and toggle user active-inactive", (done) => {
      request(sails.hooks.http.app)
        .post("/admin/toggleUser/64057bd3790487174448e122")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });
});
