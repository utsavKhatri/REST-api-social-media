const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Posts {
  id: ID!
  image: String!
  caption: String!
  postBy: User!
  like: [Like]
  comments: [Comment]
  save: [Savedpost]
  sharedWith: [PostShare]
  shares: [PostShare]
}

type Like {
  id: ID!
  user: User!
  post: Posts!
}
type Comment {
  id: ID!
  user: User!
  post: Posts!
  text: String!
}
type PostShare {
  id:ID!
  post: Posts!
  shareBy: User!
  sharedWith: User!
}
type Savedpost {
  id: ID!
  user: User!
  post: Posts!
}



  
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePic: String!
    posts: [Posts]!
    comments: [Comment]!
    likes: [Like]!
    savedposts: [Savedpost]!
    sharedPosts: [PostShare]!
    followers: [User]!
    following: [User]!
    isAdmin: Boolean!
    isActive: Boolean!
    token: String!
    bio: String
  }


  type Query {
    getAllPosts(userid:ID): [Posts!]!
    getUser(id: ID!): User!
    getAllUsers(search:String): [User!]!
    getSinglePost(id: ID!): Posts!
    getUserLike(id: ID!): [Like!]!
    getCommentlist(id: ID!): [Comment!]!
    getReceivedPost(id: ID!): [PostShare!]!
  }

`);

module.exports = schema;
