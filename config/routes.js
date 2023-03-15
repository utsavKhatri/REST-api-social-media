/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /user/posts": "UserController.postsByUser",
  "GET /home": "PostsController.home",
  "GET /search": "PostsController.getPostsBySearch",
  "GET /admin/dashboard": "AdminController.dashboard",
  "GET /admin/users/posts/:id": "AdminController.postById",
  "GET /like/:postId": "PostsController.toggleLike",
  "GET /save/:postId": "PostsController.savePost",
  "GET /profile": "UserController.userProfile",
  "GET /profile/following": "UserController.followingList",
  "GET /profile/followers": "UserController.followersList",
  "GET /profile/likes": "UserController.myLikeList",
  "GET /profile/saved": "UserController.mySaveList",
  "GET /profile/shared-post": "UserController.sharedPosts",

  "POST /login": "UserController.login",
  "POST /signup": "UserController.signup",
  "POST /logout": "UserController.logout",
  "POST /user/follow/:userid": "UserController.followUser",
  "POST /profile/change-password": "UserController.changePassword",
  "POST /comment/:postId": "PostsController.commentPost",
  "POST /profile": "UserController.updateProfile",
  "POST /create-post": "PostsController.createPost",
  "POST /admin/toggleUser/:userId": "AdminController.toggleUserIsActive",
  "POST /post/share/:postId": "PostsController.sharePost",

  "DELETE /post/:id": "PostsController.deletePost",
  "DELETE /delete-account": "UserController.deleteUser",
};
