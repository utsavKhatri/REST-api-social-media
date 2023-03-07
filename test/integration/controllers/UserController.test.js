const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("UserController", () => {
  /* This is a mocha hook. It is used to run a function before all the tests. */
  before(() => {
    console.log = function () {};
  });

  /* This is a test case for signup. */
  describe("POST /signup", () => {
    /* This is a test case for signup. check email and passowrd missing or not */
    it("should return 400 if email or password is missing", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({})
        .expect(500)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("enter something in input");
          done();
        });
    });
    /* This is a test case for create user */
    it("should return 200 and create user", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test@test.com")
        .field("password", "password")
        .field("username", "test")
        .attach("profilePhoto", __dirname + "/test.jpg")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("register successfully");
          done();
        });
    });
  });

  /* This is a test case for login. */
  describe("POST /login", () => {
    it("should return 400 if email or password is missing", (done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("Invalid Input");
          done();
        });
    });
    /* This is a test case for login. */
    it("should return 400 for an invalid password", (done) => {
      const invalidPasswordUser = {
        email: "utsav123@gmail.com",
        password: "admin121",
      }; // assuming this user exists but has an invalid password
      request(sails.hooks.http.app)
        .post("/login")
        .send(invalidPasswordUser)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("Invalid Password");
          done();
        });
    });

    it("should return 500 if user is inactive", (done) => {
      const inactiveUser = { email: "dhrupal@gmail.com", password: "123456" }; // assuming this user is inactive
      request(sails.hooks.http.app)
        .post("/login")
        .send(inactiveUser)
        .expect(500)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("admin deactive your account");
          done();
        });
    });

    it("should return 200 and a JWT token for a regular user", (done) => {
      const regularUser = { email: "utsav123@gmail.com", password: "123456" }; // assuming this user exists and is not an admin
      request(sails.hooks.http.app)
        .post("/login")
        .send(regularUser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("successfully logged in");
          expect(res.body.user).to.have.property("token");
          done();
        });
    });

    it("should return 200 and an admin token for an admin user", (done) => {
      const adminUser = {
        email: "admin@gmail.com",
        password: "admin123",
        isAdmin: "true",
      }; // assuming this user exists and is an admin
      request(sails.hooks.http.app)
        .post("/login")
        .send(adminUser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("Admin logged in successfully");
          expect(res.body.user).to.have.property("token");
          done();
        });
    });
  });
});
