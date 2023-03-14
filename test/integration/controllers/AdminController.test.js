const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("AdminController", () => {
  before(() => {
    console.log = function () {};
  });


  var token;
  describe("GET /admin/dashboard", () => {
    before((done) => {
      const adminUser = {
        email: "admin@gmail.com",
        password: "admin123",
      }; // assuming this user exists and is an admin
      request(sails.hooks.http.app)
        .post("/login")
        .send(adminUser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          token = res.body.userToken.token;
          expect(res.body.message).to.equal("Admin logged in successfully");
          expect(res.body.userToken).to.have.property("token");
          done();
        });
    });
    it("Display all user and user's post", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/dashboard")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
    it("Search user by username", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/dashboard")
        .set("Authorization", `Bearer ${token}`)
        .query({ searchTerm: "admin" })
        .expect(200, done);
    });
  });

  describe("GET /admin/users/posts/:id", () => {
    var userId;
    var token;
    before((done) => {
      const adminUser = {
        email: "admin@gmail.com",
        password: "admin123",
      }; // assuming this user exists and is an admin
      request(sails.hooks.http.app)
        .post("/login")
        .send(adminUser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          token = res.body.userToken.token;
          expect(res.body.message).to.equal("Admin logged in successfully");
          expect(res.body.userToken).to.have.property("token");
          done();
        });
    });
    it("should create dummy account", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test3@test.com")
        .field("password", "password")
        .field("username", "test3")
        .attach("profilePhoto", __dirname + "/test.jpg")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userId = res.body.data.id;
          expect(res.body.message).to.equal("register successfully");
          done();
        });
    });

    it("should return 404 if send invalid id", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/users/posts/64057cds04874448e12sdads")
        .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
    after((done) => {
      User.destroy({ email: "test3@test.com" }).exec(done);
    });
  });

  describe("POST /admin/toggleUser/:userId", () => {
    var userId;
    before((done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test6@test.com")
        .field("password", "password")
        .field("username", "test6")
        .attach("profilePhoto", __dirname + "/test.jpg")
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userId = res.body.data.id;
          done();
        });
    });
    it("should return 404 if user not found", (done) => {
      request(sails.hooks.http.app)
        .post("/admin/toggleUser/64048bc0cdbefgd")
        .set("Authorization", `Bearer ${token}`)
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
        .post(`/admin/toggleUser/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
    after((done) => {
      User.destroy({ email: "test6@test.com" }).exec(done);
    });
  });
});
