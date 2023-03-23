/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: {
      type: "string",
      required: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true
    },
    bio:{
      type: "string",
    },
    password: { type: "string", minLength: 6, required: true },
    profilePic: {
      type: "string",
      defaultsTo: "https://i.stack.imgur.com/l60Hf.png",
    },
    following: {
      collection: 'user',
      via: 'followers'
    },
    followers: {
      collection: 'user',
      via: 'following'
    },
    comments: {
      collection: 'comment',
      via: 'user'
    },
    isAdmin: { type: "boolean", defaultsTo: false },
    isActive: { type: "boolean", defaultsTo: true },
    posts: { collection: "Posts", via: "postBy"},
    likes: { collection: "like", via: "user"},
    token: { type: "string" },
    savedposts: { collection: "Savedpost", via: "user"},
    sharedPosts: { collection: "PostShare", via: "sharedWith"},

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
};
