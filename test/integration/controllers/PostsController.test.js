const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

describe("PostsController", () => {
  var userId;
  var testPost;
  var req = {
    user: {
      id: userId,
    },
  };
  var token;
  before(() => {
    console.log = function () {};
  });

  before((done) => {
    request(sails.hooks.http.app)
      .post("/signup")
      .field("email", "test4@test.com")
      .field("password", "password")
      .field("username", "test4")
      .attach("postpic", __dirname + "/test.jpg")
      .expect(200, done);
  });
  describe("GET /login", () => {
    it("should return 200 and a JWT token", (done) => {
      request(sails.hooks.http.app)
        .post("/login")
        .field("email", "test4@test.com")
        .field("password", "password")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { userToken } = res.body;
          token = userToken.token;
          userId = userToken.id;
          expect(res.body.message).to.equal("successfully logged in");
          expect(res.body.userToken).to.have.property("token");
          done();
        });
    });
  });

  describe("GET /home", () => {
    it("Display all post on homepage", (done) => {
      request(sails.hooks.http.app)
        .get("/home")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
  });

  describe("Create, like-dislike, comment", () => {
    it("POST /create-post", (done) => {
      request(sails.hooks.http.app)
        .post("/create-post")
        .set("Authorization", `Bearer ${token}`)
        .field("caption", "test caption")
        .field("postBy", userId)
        .attach("postpic", __dirname + "/test.jpg")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testPost = res.body.newPost;
          expect(res.body.message).to.equal("post created successfully");
          done();
        });
    });

    it("GET /like/:postId, like the post", (done) => {
      request(sails.hooks.http.app)
        .get(`/like/${testPost.id}`)
        .send(req.user.id)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });

    it("GET /like/:postId, dislike the post", (done) => {
      request(sails.hooks.http.app)
        .get(`/like/${testPost.id}`)
        .send(req.user.id)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });

    it("POST /comment/:postId, comment on the post", (done) => {
      request(sails.hooks.http.app)
        .post(`/comment/${testPost.id}`)
        .field("text", "test comment")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
  });

  describe("GET /search", () => {
    it("Search post and return post", (done) => {
      request(sails.hooks.http.app)
        .get("/search?searchQuery=est")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
  });

  describe("DELETE /post/:id", () => {
    it("should return 200 and delete post", (done) => {
      request(sails.hooks.http.app)
        .delete(`/post/${testPost.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200, done);
    });
  });

  after((done) => {
    User.destroy({ email: "test4@test.com" }).exec(done);
  });
});
