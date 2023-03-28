const resolvers = {
  /**
   * @description: This is a resolver function that is used to get all posts
   * @async
   * @param {ObjectId} {id}
   * @return {Object} allPosts
   */
  getAllPosts: async ({ userid }) => {
    let search = {};
    if (userid) {
      search = { postBy: userid };
    }
    const posts = await Posts.find(search).populateAll().sort("createdAt DESC");
    const allPosts = posts.map(async (post) => {
      const likes = await Like.find({ post: post.id }).populateAll();
      const comments = await Comment.find({ post: post.id }).populateAll();
      const savedposts = await Savedpost.find({ post: post.id }).populateAll();
      const sharedposts = await PostShare.find({ post: post.id }).populateAll();
      post.like = likes.map((like) => {
        return {
          ...like,
        };
      });
      post.comments = comments.map((comment) => {
        return {
          ...comment,
        };
      });
      post.save = savedposts.map((savedpost) => {
        return {
          ...savedpost,
        };
      });
      post.sharedWith = sharedposts.map((sharedpost) => {
        return {
          ...sharedpost,
        };
      });
      return post;
    });
    return Promise.all(allPosts);
  },

  /**
   * @description: This is a resolver function that is used to get single user by id
   * @async
   * @param {ObjectId} {id}
   * @return {Object} user
   */
  getUser: async ({ id }) => {
    const user = await User.findOne({ id: id }).populateAll();
    const comments = await Comment.find({ user: id }).populateAll();
    const posts = await Posts.find({ postBy: id }).populateAll();
    const likes = await Like.find({ user: id }).populateAll();
    const savedposts = await Savedpost.find({ user: id }).populateAll();
    const sharedposts = await PostShare.find({ sharedWith: id }).populateAll();
    user.comments = comments.map((comment) => {
      return {
        ...comment,
      };
    });
    user.posts = posts.map((post) => {
      return {
        ...post,
      };
    });
    user.likes = likes.map((like) => {
      return {
        ...like,
      };
    });
    user.savedposts = savedposts.map((savedpost) => {
      return {
        ...savedpost,
      };
    });
    user.sharedPosts = sharedposts.map((sharedpost) => {
      return {
        ...sharedpost,
      };
    });

    return user;
  },

  /**
   * @description: This is a resolver function that is used to get like list of user
   * @async
   * @param {ObjectId} {id}
   * @return {Object} likes
   */
  getUserLike: async ({ id }) => {
    const likes = await Like.find({ user: id }).populateAll();
    return likes;
  },

  /**
   * @description: This is a resolver function that is used to get comment list of user
   * @async
   * @param {ObjectId} {id}
   * @return {Object} comments
   */
  getCommentlist: async ({ id }) => {
    const comments = await Comment.find({ user: id }).populateAll();
    return comments;
  },

  /**
   * @description: This is a resolver function that is used to get single post by id
   * @async
   * @param {ObjectId} {id}
   * @return {Object} post
   */

  getSinglePost: async ({ id }) => {
    const post = await Posts.findOne({ id: id }).populateAll();
    const likes = await Like.find({ post: post.id }).populateAll();
    const comments = await Comment.find({ post: post.id }).populateAll();
    const savedposts = await Savedpost.find({ post: post.id }).populateAll();
    const sharedposts = await PostShare.find({ post: post.id }).populateAll();
    post.like = await likes.map((like) => {
      return {
        ...like,
      };
    });
    post.comments = await comments.map((comment) => {
      return {
        ...comment,
      };
    });
    post.save = await savedposts.map((savedpost) => {
      return {
        ...savedpost,
      };
    });
    post.sharedWith = await sharedposts.map((sharedpost) => {
      return {
        ...sharedpost,
      };
    });
    return post;
  },

  /**
   * @description: This is a resolver function that is used to get all user data.
   * @async
   * @param {ObjectId} {id}
   * @return {Object} users
   */

  getAllUsers: async ({ search }) => {
    let searchQuery = {};
    if (search) {
      searchQuery = {
        or: [
          { username: { contains: search } },
          { email: { contains: search } },
          { bio: { contains: search } },
        ],
      };
    }

    const users = await User.find(searchQuery).populateAll().meta({
      makeLikeModifierCaseInsensitive: true,
    });
    return users;
  },

  /**
   * @description: This is a resolver function that is used to get all the posts that are shared with a particular user.
   * @async
   * @param {ObjectId} {id}
   * @return {Object} data
   */

  getReceivedPost: async ({ id }) => {
    const data = await PostShare.find({
      sharedWith: id,
    }).populateAll();
    return data;
  },
};

module.exports = resolvers;
