/**
 * PostsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  home: async (req, res) => {
    try {
      const postData = await Posts.find()
        .populate("postBy")
        .populate("comments", { limit: 10, select: ["text"] })
        .sort("createdAt DESC")
        .select(["id", "image", "caption","postBy"]);
      res.json(postData);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const { text, caption } = req.body;
      const id = req.user.id;
      console.log("asdsadasd    ", req.user);
      let postPic;
      await req.file("postpic").upload(
        {
          dirname: require("path").resolve(
            sails.config.appPath,
            "assets/images/posts"
          ),
          maxBytes: 10000000, // 10 MB
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.serverError(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest("No file was uploaded");
          }
          console.log("------------------", uploadedFiles[0]);
          postPic = require("path").basename(uploadedFiles[0].fd);
          postPic = postPic.split("posts/")[0];
          console.log("inside  ", postPic);
          console.log(postPic, text, caption);

          const newPost = await Posts.create({
            text: text,
            image: postPic,
            caption: caption,
            postBy: req.user.id,
          }).fetch();

          return res.json({
            newPost,
          });
        }
      );

      // res.send('successfully to create post page');
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  userByPost: async (req, res) => {
    const { id } = req.params;
    try {
      const userByPost = await Posts.findById(id).populate("user");
      res.json(userByPost);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  getPostsBySearch: async (req, res) => {
    const { searchQuery } = req.query;

    try {
      const posts = await Posts.find({
        text: { $regex: searchQuery, $options: "i" },
      });

      res.json({ data: posts });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      await Posts.findByIdAndRemove(id);
      res.json({ message: "Post deleted successfully." });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  // Like a post if not already liked
  toggleLike: async (req, res) => {
    const { postId } = req.params;
    try {
      const postToLike = await Posts.findOne({ id: postId });
      console.log("---------------  ", postToLike);
      // Add the user to the current user's following list
      const alreadyLike = await Posts.findOne({ id: postToLike.id }).populate(
        "like",
        { id: req.user.id }
      );

      if (alreadyLike.like.length > 0) {
        await Posts.removeFromCollection(postToLike.id, "like", req.user.id);
        const updatedPost = await Posts.findOne({ id: postToLike.id }).populate(
          "like"
        );
        return res.json(updatedPost);
      }
      await Posts.addToCollection(postToLike.id, "like", req.user.id);

      // Return the updated user object
      const updatedPost = await Posts.findOne({ id: postToLike.id }).populate(
        "like"
      );
      return res.json(updatedPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // PostController.js

  commentPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const { text } = req.body;

      // Ensure that the post exists
      const post = await Posts.findOne({ id: postId });
      if (!post) {
        return res.badRequest("Invalid post ID");
      }

      // Create the comment
      const comment = await Comment.create({
        user: userId,
        post: postId,
        text: text,
      }).fetch();

      // Add the comment to the post's comments collection
      await Posts.addToCollection(postId, "comments", comment.id);
      const newData = await Posts.find({ id: postId }).populate("comments");

      return res.json({ comment, message: "<--------*------->", newData });
    } catch (error) {
      return res.serverError(error.message);
    }
  },
};
