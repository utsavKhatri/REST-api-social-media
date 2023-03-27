const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("UserController", () => {
  before(() => {
    console.log = function () {};
  });

  describe("POST /signup", () => {
    it("should return 400 if email or password is missing", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send()
        .expect(500)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("enter something in input");
          done();
        });
    });
    it("should return 200 and create user", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test@test.com")
        .field("password", "password")
        .field("username", "test")
        .attach("postpic", __dirname + "/test.jpg")
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("register successfully");
          done();
        });
    });

    it("should return 409 if email already exist", (done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test@test.com")
        .field("password", "password")
        .field("username", "test1")
        .attach("postpic", __dirname + "/test.jpg")
        .expect(409)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("User already exists");
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("should return 400 if email or password is missing", (done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send()
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
        email: "test@test.com",
        password: "admin121",
      };
      request(sails.hooks.http.app)
        .post("/login")
        .field("email", "test@test.com")
        .field("password", "admin121")
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("Invalid Password");
          done();
        });
    });

    it("should return 200 and a JWT token for a regular user", (done) => {
      const regularUser = { email: "test@test.com", password: "password" };
      request(sails.hooks.http.app)
        .post("/login")
        .send(regularUser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("successfully logged in");
          expect(res.body.userToken).to.have.property("token");
          done();
        });
    });
  });

  describe("GET /profile", () => {
    var usertoken;
    var profileId;
    before((done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "test@test.com", password: "password" })
        .end((err, res) => {
          const { userToken } = res.body;
          console.log(res.body);
          if (err) {
            return done(err);
          }
          usertoken = userToken.token;
          profileId = userToken.id;
          done();
        });
    });
    it("should return 200 and a user profile by pass id in query", (done) => {
      request(sails.hooks.http.app)
        .get(`/profile?id=${profileId}`)
        .set("Authorization", `Bearer ${usertoken}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it("should return 200 and a user profile of current logged user", (done) => {
      request(sails.hooks.http.app)
        .get("/profile")
        .set("Authorization", `Bearer ${usertoken}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe("POST /user/follow/:userid", () => {
    let followUserId;
    let token;
    before((done) => {
      request(sails.hooks.http.app)
        .post("/signup")
        .field("email", "test2@test.com")
        .field("password", "password")
        .field("username", "test2")
        .attach("postpic", __dirname + "/test.jpg")
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          followUserId = res.body.newUser.id;
          expect(res.body.message).to.equal("register successfully");
          done();
        });
    });
    it("should login dummy account", (done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "test@test.com", password: "password" })
        .end((err, res) => {
          const { userToken } = res.body;
          if (err) {
            return done(err);
          }
          token = userToken.token;
          testUser = userToken.id;
          done();
        });
    }).timeout(5000);
    it("should return 404 if invalid userId", (done) => {
      request(sails.hooks.http.app)
        .post("/user/follow/640eec56bfdff4548bc0cdbc12")
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message).to.equal("User not found");
          done();
        });
    }).timeout(10000);
    it("should return 200 and follow a user", (done) => {
      request(sails.hooks.http.app)
        .post(`/user/follow/${followUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    }).timeout(5000);
    it("should return 200 and unfollow followed user", (done) => {
      request(sails.hooks.http.app)
        .post(`/user/follow/${followUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
    it("should logout user", (done) => {
      request(sails.hooks.http.app)
        .post("/logout")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
    after((done) => {
      User.destroy({
        email: ["test2@test.com", "test@test.com"],
      }).exec(done);
    });
  });
});
