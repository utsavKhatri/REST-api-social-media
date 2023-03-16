/**
 * PostsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
    const { page, pageSize, searchTerm } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(pageSize, 10) || 10;
    const skip = (currentPage - 1) * itemsPerPage;
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = {
        caption: { contains: searchTerm },
      };
    }
    try {
      const postData = await Posts.find(searchQuery)
        .populate("postBy")
        .populate("like")
        .populate("comments")
        .sort("createdAt DESC").populate("sharedWith").populate("save")
        .skip(skip)
        .limit(itemsPerPage)
        .meta({
          makeLikeModifierCaseInsensitive: true,
        });
      const totalItems = await Posts.count();
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const displayData = postData.map((post) => {
        return {
          id: post.id,
          image: post.image,
          caption: post.caption,
          postBy: post.postBy.username,
          likes: post.like.length,
          saves: post.save.length,
          shares: post.sharedWith.length,
          comments: post.comments.map((c) => {
            return c.text;
          }),
        };
      });
      res.json({
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        displayData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
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
      if (!caption) {
        return res.status(500).json({ message: "enter something in caption" });
      }
      let postPic;
      await req.file("postpic").upload(
        {
          dirname: require("path").resolve(sails.config.appPath, "assets"),
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
          const result = await sails.config.custom.cloudinary.uploader.upload(
            postPic,
            {
              unique_filename: true,
            }
          );

          // Delete image from local storage
          sails.config.custom.fs.unlink(postPic, (err) => {
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
            message: "post created successfully",
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
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
    let searchQueryObj = {};
    if (searchQuery) {
      searchQueryObj = {
        caption: { contains: searchQuery },
      };
    }
    try {
      /* Searching for posts that contain the searchQuery in the caption. */
      const posts = await Posts.find(searchQueryObj).meta({
        makeLikeModifierCaseInsensitive: true,
      });

      /* This is checking if the posts array is empty. If it is, it returns a 404 status code with a message. */
      if (posts.length < 1) {
        return res
          .status(404)
          .json({ message: "no post contain following query" });
      }

      return res.json({ data: posts });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * save post by user
   * @param {Object} req - postId and userId
   * @param {Object} res - response object postShare
   * @returns {Object} Returns a JSON object updated savePost
   * @throws {Error} Throws an error if there is an issue sharePost
   */
  savePost: async (req, res) => {
    const { postId } = req.params;
    try {
      const postToSave = await Posts.findOne({ id: postId });

      if (!postToSave) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Add the user to the current user's following list
      const saveId = await Savedpost.find({ user: req.user.id });
      const alreadySave = await Savedpost.findOne({
        user: req.user.id,
        post: postId,
      });
      if (alreadySave) {
        await Savedpost.destroy({ id: saveId.id });
        const updatedPost = await Posts.findOne({ id: postToSave.id }).populate(
          "save"
        );
        console.log("updatedPost--->", updatedPost);
        return res.json(updatedPost);
      }
      const savePost = await Savedpost.create({
        user: req.user.id,
        post: postId,
      }).fetch();
      await Posts.addToCollection(postToSave.id, "save", savePost.id);

      // Return the updated user object
      const updatedPost = await Posts.findOne({ id: postToSave.id }).populate(
        "save"
      );
      return res.json(updatedPost);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  /**
   * allow user to share post to other user
   * @param {Object} req - postId and userId of the user who wants to share the post.
   * @param {Object} res - response object.
   * @returns {Object} Returns a JSON object updated savePost
   * @throws {Error} Throws an error if there is an issue retrieving savePost.
   */
  sharePost: async (req, res) => {
    const { postId } = req.params;
    try {
      const postToShare = await Posts.findOne({ id: postId });
      if (!postToShare) {
        return res.status(404).json({ message: "Post not found" });
      }
      const sharedWith = req.body.sharedWith;
      console.log("sharedWith--->", sharedWith);
      if (sharedWith === req.user.id) {
        return res
          .status(400)
          .json({ message: "You cannot share your own post" });
      }
      if (!sharedWith || sharedWith.length === 0) {
        return res.badRequest(
          "At least one user must be specified to share the post with."
        );
      }
      const users = await User.find();
      console.log("users--->", users);
      const postShare = await PostShare.create({
        post: postId,
        sharedWith: sharedWith,
        shareBy: req.user.id,
      }).fetch();
      return res.json(postShare);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
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
      const isValidUser = await Posts.findOne({ id: id });
      if (isValidUser.postBy === req.user.id) {
        const deletedLike = await Like.destroy({ post: id });
        const deletedComment = await Comment.destroy({ post: id });
        const deletedPost = await Posts.destroy({ id: id });
        return res.json({ message: "Post deleted successfully." });
      }
      return res.json({
        message: "You are not authorized to delete this post.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
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

      if (!postToLike) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Add the user to the current user's following list
      const likeId = await Like.find({ user: req.user.id });
      const alreadyLike = await Like.findOne({
        user: req.user.id,
        post: postId,
      });
      if (alreadyLike) {
        await Like.destroy({ id: likeId.id });
        const updatedPost = await Posts.findOne({ id: postToLike.id }).populate(
          "like"
        );
        console.log("updatedPost--->", updatedPost);
        return res.json(updatedPost);
      }
      const likePost = await Like.create({
        user: req.user.id,
        post: postId,
      }).fetch();
      await Posts.addToCollection(postToLike.id, "like", likePost.id);

      // Return the updated user object
      const updatedPost = await Posts.findOne({ id: postToLike.id }).populate(
        "like"
      );
      return res.json(updatedPost);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
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
      return res.status(500).json({ message: error.message });
    }
  },
};
