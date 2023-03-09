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

  describe("Create, like-dislike, comment, delete post", () => {
    var testPost;
    var userId;
    var req = {
      user: {
        id: userId,
      },
    };
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
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });

    it("GET /like/:postId, dislike the post", (done) => {
      request(sails.hooks.http.app)
        .get(`/like/${testPost.id}`)
        .send(req.user.id)
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });

    it("POST /comment/:postId, comment on the post", (done) => {
      request(sails.hooks.http.app)
        .post(`/comment/${testPost.id}`)
        .send({ text: "test comment" })
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });

    it("DELETE /post/:id", (done) => {
      let req = {
        user: {
          id: userId,
        },
      };
      request(sails.hooks.http.app)
        .delete(`/post/${testPost.id}`)
        .send(req.user.id)
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });

  describe("GET /search", () => {
    it("Search post and return post", (done) => {
      request(sails.hooks.http.app)
        .get("/search?searchQuery=env")
        .set("Authorization", `Bearer ${token}`) // set the Authorization header with the JWT token
        .expect(200, done);
    });
  });
});
