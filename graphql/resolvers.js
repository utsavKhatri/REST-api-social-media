const {Posts} = require('../api/models/Posts');
// const resolvers = {
//   Query: {
//     // Fetch all posts
//     posts: async () => {
//       const posts = await Posts.find().populateAll();
//       return posts;
//     },

//     // Fetch post by ID
//     // post: async (_, { id }) => {
//     //   const post = await Posts.findOne({ id }).populate('postBy').populate('like').populate('comments').populate('save').populate('sharedWith');
//     //   return post;
//     // },

//     // Fetch all users
//     users: async () => {
//       const users = await User.find().populate('following').populate('followers').populate('comments').populate('posts').populate('likes').populate('savedposts').populate('sharedPosts');
//       return users;
//     },

//     // Fetch user by ID
//     user: async (_, { id }) => {
//       const user = await User.findOne({ id }).populate('following').populate('followers').populate('comments').populate('posts').populate('likes').populate('savedposts').populate('sharedPosts');
//       return user;
//     },
//   },

//   Mutation: {
//     // Create new post
//     createPost: async (_, { input }) => {
//       const post = await Posts.create(input).fetch().populateAll();
//       return post;
//     },
//     // Update post by ID
//     updatePost: async (_, { id, input }) => {
//       const post = await Posts.updateOne({ id }).set(input).populate('postBy').populate('like').populate('comments').populate('save').populate('sharedWith');
//       return post;
//     },

//     // Delete post by ID
//     deletePost: async (_, { id }) => {
//       const post = await Posts.destroyOne({ id });
//       return post;
//     },

//     // Create new user
//     createUser: async (_, { input }) => {
//       const user = await User.create(input).fetch().populate('following').populate('followers').populate('comments').populate('posts').populate('likes').populate('savedposts').populate('sharedPosts');
//       return user;
//     },

//     // Update user by ID
//     updateUser: async (_, { id, input }) => {
//       const user = await User.updateOne({ id }).set(input).populate('following').populate('followers').populate('comments').populate('posts').populate('likes').populate('savedposts').populate('sharedPosts');
//       return user;
//     },

//     // Delete user by ID
//     deleteUser: async (_, { id }) => {
//       const user = await User.destroyOne({ id });
//       return user;
//     },
//   },
// };
const resolvers = {
  Query: {
    postsa: () => {
        const result = "askdgasjkdgasgd";
        return result;
    },
  },
};


module.exports = resolvers;
