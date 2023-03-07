const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("PostsController", () => {
  var token; // this will store the JWT token
  var userId;
  before(() => {
    //silence the console
    console.log = function () {};
  });

  describe("GET /home", () => {
    before((done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ email: "utsav123@gmail.com", password: "123456" }) // assuming your authentication endpoint is /auth/login
        .end((err, res) => {
          const { user } = res.body;
          if (err) {
            return done(err);
          }
          token = user.token;
          userId = user.id;
          done();
        });
    });

    it("Display all post on homepage", (done) => {
      request(sails.hooks.http.app)
        .get("/home")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });

  describe("POST /create-post", () => {
    it("Create a post", (done) => {
      request(sails.hooks.http.app)
        .post("/create-post")
        .set("Authorization", `Bearer ${token}`)
        .field("caption", "test caption")
        .attach("postpic", __dirname + "/test.jpg")
        .expect(200, done);
    });
  });

  describe("GET /search", () => {
    it("Search post and return post", (done) => {
      request(sails.hooks.http.app)
        .get("/search")
        .send({ searchQuery: "test" })
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });
});
