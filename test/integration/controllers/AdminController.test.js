const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("AdminController", () => {
  var token;
  var testUser;
  before(() => {
    console.log = function () {};
  });

  before((done) => {
    request(sails.hooks.http.app)
      .post("/signup")
      .field("email", "admin@gmail.com")
      .field("password", "password")
      .field("username", "admin")
      .attach("profilePhoto", __dirname + "/test.jpg")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).to.equal("admin register successfully");
        done();
      });
  });

  before((done) => {
    request(sails.hooks.http.app)
      .post("/login")
      .send({ email: "admin@test.com", password: "password" })
      .expect(200)
      .end((err, res) => {
        // console.warn("------*&*&----- 666 -->", res.body);
        if (err) {
          return done(err);
        }
        const { userToken } = res.body;
        token = userToken.token;
        testUser = userToken.id;
        done();
      });
  });

  describe("GET /admin/dashboard", () => {
    it("Display all user and user's post", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/dashboard")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
  });

  after(() => {
    User.destroy({
      id: testUser,
    });
  });

  describe("GET /admin/users/posts/:id", () => {
    let userId;
    before((done) => {
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

          expect(res.body.message).to.equal("register successfully");
          done();
        });
    });
    before((done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "test3@gmail.com", password: "password" })
        .end((err, res) => {
          const { userToken } = res.body;
          if (err) {
            return done(err);
          }
          userId = userToken.id;
          done();
        });
    });
    it("should return 404 if send invalid id", (done) => {
      request(sails.hooks.http.app)
        .get("/admin/users/posts/64057cds04874448e12sd")
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
    after(async () => {
      await User.destroy({ id: userId });
    });
  });

  describe("POST /admin/toggleUser/:userId", () => {
    let userId;
    before((done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test4@test.com")
        .field("password", "password")
        .field("username", "test4")
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
    before((done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "test4@gmail.com", password: "password" })
        .end((err, res) => {
          const { userToken } = res.body;
          if (err) {
            return done(err);
          }
          userId = userToken.id;
          done();
        });
    });
    it("should return 404 if user not found", (done) => {
      request(sails.hooks.http.app)
        .post("/admin/toggleUser/640eec73bfdff4548bc0cdbefgd")
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
    after(async () => {
      await User.destroy({ id: userId });
    });
  });
});
