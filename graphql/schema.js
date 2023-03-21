const { buildSchema } = require('graphql');

const schema = buildSchema(`
type Posts {
  id: ID!
  image: String
  caption: String!
  postBy: User!
}

input PostInput {
  image: String
  caption: String!
  postBy: ID!
}


type Mutation {
  createPost(input: PostInput!): Posts
  updatePost(id: ID!, input: PostInput!): Posts
  deletePost(id: ID!): Posts
}

  
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePic: String!
    isAdmin: Boolean!
    isActive: Boolean!
    posts: [Posts]!
    token: String!
    createdAt: String!
    updatedAt: String!
  }


  type Query {
    postsa: String!
  }

`);

module.exports = schema;
