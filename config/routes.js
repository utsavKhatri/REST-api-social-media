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

"POST /login":"UserController.login",
"POST /signup":"UserController.signup",
"POST /logout":"UserController.logout",
"POST /user/follow/:userid":"UserController.followUser",
"POST /user/unfollow/:userid":"UserController.unFollowUser",
"POST /user/posts/:id":"UserController.postsByUser",
"GET /home":"PostsController.home",
"GET /search":"PostsController.getPostsBySearch",
"POST /like/:id":"PostsController.likePost",
"POST /comment/:id":"PostsController.commentPost",
"DELETE /post":"PostsController.deletePost",
"POST /create-post":"PostsController.createPost"


};
