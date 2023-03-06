/**
 * PostsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.KEY,
  api_secret: process.env.API_SECRET
});

module.exports = {
  /**
   * Retrieves posts with details of the user who created it and the last 10 comments made on it.
   * Sorts the posts in descending order based on the creation date.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @throws {Error} - Throws an error if there's an issue retrieving the data
   * @returns {Object} - JSON object containing post data with user and comment details
   */
  home: async (req, res) => {
    try {
      const postData = await Posts.find()
        .populate("postBy")
        .populate("comments", { limit: 10, select: ["text"] })
        .sort("createdAt DESC")
        .select(["id", "image", "caption", "postBy"]);
      res.json(postData);
    } catch (error) {
      console.error(error);
    res.serverError({ message: error.message });
    }
  },
  /**
   * Creates a new post with an image and returns the newly created post as a JSON object.
   * @param {Object} req.body - The text and caption of the post being created.
   * @param {string} req.user.id - The ID of the user creating the post.
   * @param {Object} res - Express response object.
   * @returns {Object} Returns a JSON object containing the newly created post.
   * @throws {Error} Throws an error if there is an issue creating the post.
   */

  createPost: async (req, res) => {
    try {
      const { caption } = req.body;
      const id = req.user.id;
      console.log("asdsadasd    ", req.user);
      if (!caption) {
        return res.status(500).json({message:"enter something in caption"});
      }
      let postPic;
      await req.file("postpic").upload(
        {
          dirname: require("path").resolve(
            sails.config.appPath,
            "assets"
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
          postPic = uploadedFiles[0].fd;
          const result = await cloudinary.uploader.upload(postPic);

          // Delete image from local storage
          fs.unlink(postPic, (err) => {
            if (err) {
              return console.log(err);
            }
            console.log("successfully deleted");
          });
          console.log(result.secure_url, caption);

          const newPost = await Posts.create({
            image: result.secure_url,
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

  /**
   * Retrieves a user associated with a specific post and returns the post with the user information as a JSON object.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {string} req.params.id - The ID of the post to retrieve the associated user for.
   * @returns {Object} Returns a JSON object containing the post with the associated user information.
   * @throws {Error} Throws an error if there is an issue retrieving the post or associated user.
   */
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

  /**
   * Retrieves posts based on a search query and returns them as a JSON object.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {string} req.query.searchQuery - The search query to use for searching posts by caption.
   * @returns {Object} Returns a JSON object containing posts that match the search query.
   * @throws {Error} Throws an error if there is an issue retrieving posts.
   */
  getPostsBySearch: async (req, res) => {
    const { searchQuery } = req.query;

    try {
      const posts = await Posts.find({
        caption: { contains: searchQuery },
      });

      if (posts.length<1) {
        return res.status(404).json({message:"no post contain following query"});
      }

      res.json({ data: posts });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  /**
   * Delete a post and associated comments for a given post id.
   * @param {string} req.params.id - The id of the post to be deleted.
   * @param {Object} req.user - The user object.
   * @param {string} req.user.id - The id of the user deleting the post.
   * @returns {Object} - The success message if post is deleted successfully, else unauthorized message.
   * @throws {Object} - The error object, if an error occurs while processing the request.
   */

  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const isValidUser = await Posts.findOne({ id: id }).populate("postBy");
      if (isValidUser.postBy.id === req.user.id) {
        const deletedComment = await Comment.destroy({ post: id });
        const deletedPost = await Posts.destroy({ id: id });
        return res.json({ message: "Post deleted successfully." });
      }
      return res.json({
        message: "You are not authorized to delete this post.",
      });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  },

  /**
   *
   * Toggle like functionality for a specific post.
   * @param {string} req.params.postId - The id of the post to toggle like for.
   * @param {Object} req.user - The user object.
   * @returns {Object} - The updated post object with the like status.
   * @throws {Object} - The error object, if an error occurs while processing the request.
   */
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

  /**
   *
   * Adds a new comment to a post and returns the updated post with the new comment as a JSON object
   * @param {string} req.params.postId - The ID of the post to add a comment to.
   * @param {string} req.user.id - The ID of the user adding the comment.
   * @param {string} req.body.text - The text of the comment being added.
   * @returns {Object} Returns a JSON object containing the newly added comment and the updated post with the new comment.
   * @throws {Error} Throws an error if there is an issue adding the comment to the post.
   */
  commentPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const { text } = req.body;

      // Ensure that the post exists
      const post = await Posts.findOne({ id: postId });
      if (!post && !text) {
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

      return res.json({ commentedData: newData });
    } catch (error) {
      return res.serverError(error.message);
    }
  },
};
